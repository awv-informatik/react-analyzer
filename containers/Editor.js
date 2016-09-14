import React from 'react';
import { animateScroll, Link } from 'react-scroll';
import { connect } from 'react-redux';

import JSONTree from 'react-json-tree'
import AceEditor from 'react-ace';
import 'brace/mode/jsx';
import 'brace/theme/xcode';

import Presentation from 'awv3/misc/presentation';
import Object3 from 'awv3/three/object3';
import SocketIO from 'awv3/communication/socketio';
import Rest from 'awv3/communication/rest';

import Canvas from '../components/Canvas';
import View from '../components/View';

@connect(state => ({ template: state.settings.templates.javascript, text: state.settings.editorText, url: state.settings.url }))
export default class Editor extends React.Component {
    static propTypes = { text: React.PropTypes.string, template: React.PropTypes.string }
    static defaultProps = { text: "", template: "" }

    constructor() {
        super();
        this.state = {
            top: true,
            editorLabel: "Press [ CTRL - S ] to compile",
            editorLabelIcon: "large info icon",
            editorLabelBg: "#64a8db",
            editorError: false,
            resultsUp: false,
            results: []
        };
    }

    async componentDidMount() {

        window.addEventListener("keydown", this.listen);

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
            } else if (context.command === 'Result') {
                context = context.result;
            }
            if (!Array.isArray(context) || typeof context !== 'object')
                context = [context];
            this.setState({ results: context });
            this.toggle(false);
        }

    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.listen);
    }

    render() {

        let text = this.props.text || this.props.template;

        return (
            <div id="container" style={style.container}>

                <div id="top" style={style.top}>

                    <div style={style.wrapper}>

                        <div style={style.editor}>

                            <AceEditor
                                ref="ace" name="randomname" mode="jsx" theme="xcode"
                                editorProps={{ $blockScrolling: true }}
                                height="100%" width="100%"
                                value={ text }
                                setOptions={{
                                    hScrollBarAlwaysVisible: false,
                                    vScrollBarAlwaysVisible: false,
                                    animatedScroll: true,
                                    showLineNumbers: true,
                                    showInvisibles: true,
                                    useSoftTabs: true,
                                    wrap: true,
                                    behavioursEnabled: true,
                                    wrapBehavioursEnabled: true,
                                    maxLines: Infinity
                                }} />

                            <div style={{ ...style.editorHandle, height: this.state.editorError ? 200 : 40, backgroundColor: this.state.editorLabelBg }}>
                                <i className={this.state.editorLabelIcon} />
                                <span style={{ marginLeft: 10 }}>{this.state.editorLabel}</span>
                            </div>
                        </div>

                        <div id="view" style={style.view}>

                            <Canvas style={style.canvas}>
                                <View ref="view" up={ [0, 1, 0] } />
                            </Canvas>

                            <div className="results" style={{
                                ...style.results, transform: `translate3d(0,${ this.state.resultsUp ? '0' : 'calc(100% - 40px)' },0)` }}>

                                <div ref="results-handle" style={{
                                    ...style.resultsHandle, backgroundColor: this.state.results.length > 0 ? '#11cc77' : '#c6c6c6' }} onClick={this.toggleResults}>

                                    <i className={`large ${this.state.resultsUp ? 'headsup' : ''} chevron up icon`} style={{ transition: 'transform .2s'}}/>
                                    <span style={{ marginLeft: 10 }}>Results</span>

                                </div>

                                <JSONTree data={this.state.results} />

                            </div>

                        </div>

                    </div>

                </div>

                <sidebar style={style.sideBar}>
                    <i ref="icon"
                        className={`${this.state.top ? '' : 'headsup'} big blue link chevron down icon`}
                        style={{ transition: 'transform .2s'}} onClick={() => this.toggle()} />
                </sidebar>

            </div>
        );
    }

    toggle = (top = !this.state.top) => {
        this.setState({ top });
        if (top)
            animateScroll.scrollToTop({ containerId: 'container' });
        else
            animateScroll.scrollToBottom({ containerId: 'container' });
    }

    toggleResults = () => {
        this.setState({ resultsUp: !this.state.resultsUp });
    }

    listen = async (e) => {

        if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();

            let timeout;
            try {

                // Get code from editor and compile using eval
                let value = this.refs.ace.editor.getValue();
                this.props.dispatch({ type: "SET_EDITOR_TEXT", editorText: value });

                if (typeof Babel !== 'undefined') {
                    // Babel is available, let's translate the code
                    value = `(async () => { ${value} })()`;
                    value = Babel.transform(value, { presets: ['es2015', 'stage-0'] }).code;
                }

                let promise = eval(value);

                this.setState({
                    editorError: false,
                    editorLabel: "compiled successfully",
                    editorLabelIcon: "large check icon",
                    editorLabelBg: "#11cc77"
                });

                timeout = setTimeout(() => {
                    this.view.canvas.renderer.resize();
                    setTimeout(() => this.setState({ editorLabelBg: "#64a8db", editorError: false }), 1000);
                }, 500);

                await promise;

            } catch (reason) {

                clearTimeout(timeout)

                this.setState({
                    editorError: true,
                    editorLabel: reason.message,
                    editorLabelIcon: "large remove icon",
                    editorLabelBg: "#D81B60"
                });
            }

        }
    }
}

 const style = {
     container: { position: 'absolute',  width: '100%', height: '100%', overflow: 'hidden' },
     top: { display: 'flex', width: '100%', height: '100%' },
     wrapper: { flex: 1, height: '100%' },
     editor: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%' },
     editorHandle: { display: 'flex', alignItems: 'center', paddingLeft: 50, fontSize: 14, fontWeight: 'bold', color: 'white', transition: 'background-color, height .5s', borderTop: '1px #b5b5b5 solid', whiteSpace: 'pre', fontFamily: 'monospace' },
     view: { position: 'relative', width: '100%', height: '100%', overflow: 'hidden' },
     canvas: { backgroundColor: '#efefef', position: 'relative', height: '100%', width: '100%' },
     results: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#dfdfdf', transition: 'transform .5s' },
     resultsHandle: { display: 'flex', alignItems: 'center', paddingLeft: 50, height: 40, fontSize: 14, fontWeight: 'bold',
     color: 'white', transition: 'background-color 1s', cursor: 'pointer',
     borderTop: '1px #b5b5b5 solid' },
     sideBar: { position: 'fixed', top: 74, right: 40, color: 'white', cursor: 'pointer' }
 }
