import React from 'react';
import { connect } from 'react-redux';
import Presentation from 'awv3/misc/presentation';
import Object3 from 'awv3/three/object3';
import SocketIO from 'awv3/communication/socketio';
import Rest from 'awv3/communication/rest';
import Editor from '../components/Editor';
import View from '../components/View';

@connect(state => ({ template: state.settings.templates.javascript, text: state.settings.editorText, url: state.status.url }))
export default class Proto extends React.Component {
    static propTypes = { text: React.PropTypes.string, template: React.PropTypes.string }
    static defaultProps = { text: "", template: "" }

    state = { top: true, results: [] }

    componentDidMount() {
        let view = this.view = this.refs.view.viewImpl;
        let presenter = new Presentation([], { ambient: 1 });
        window.SocketIO = SocketIO;
        window.Rest = Rest;
        window.Object3 = Object3;
        window.Presentation = Presentation;
        window.view = view;
        window.url = this.props.url;

        window.clear = () => {
            view.scene.destroy();
            presenter = new Presentation([], { ambient: 1 });
            view.scene.add(presenter);
            this.setState({ results: [] });
        };

        window.show = ({ models }) => {
            presenter.add(models);
            view.updateBounds().controls.focus().zoom().rotateTheta(Math.PI / 2);
            this.toggle(false);
        };

        window.results = (context) => {
            if (Array.isArray(context) && context.length === 1)
                context = context[0]
            if (context.results) {
                context = context.results.map(item => item.result);
                if (context.length === 1)
                    context = context[0]
            } else if (context.command === 'Result')
                context = context.result;
            if (!Array.isArray(context) || typeof context !== 'object')
                context = [context];

            this.setState({ results: context });
            this.toggle(false);
        }
    }

    render() {
        return (
            <div  style={styles.wrapper}>
                <div ref="container" style={styles.container}>
                    <Editor text={this.props.text || this.props.template} />
                    <View ref="view" results={this.state.results} />
                </div>
                <sidebar style={styles.sideBar}>
                    <i ref="icon" className={`${this.state.top ? '' : 'headsup'} big blue link chevron down icon`}
                        style={{ transition: 'transform .2s'}} onClick={() => this.toggle()} />
                </sidebar>
            </div>
        );
    }

    toggle = (top = !this.state.top) => {
        this.view.canvas.renderer.resize()
        this.setState({ top });
        this.refs.container.style.transform = top ?
            'translate3d(0, 0, 0)' :
            'translate3d(0, calc(-100vh + 60px), 0)';
    }
}

const styles = {
    wrapper: { position: 'absolute', width: '100%' },
    container: { position: 'absolute', width: '100%', transition: 'transform .5s',
    transform: 'translate3d(0, 0, 0)', willChange: 'transform' },
    sideBar: { position: 'fixed', top: 74, right: 40, color: 'white', cursor: 'pointer' }
 }
