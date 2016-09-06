import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import { store } from '../store';

import GoldenLayout from 'golden-layout';
import SingleView from '../components/SingleView';
import Log from '../components/Log';
import Editor from '../components/Editor';

class App extends React.Component {

    componentDidMount() {

        let content = store.getState().settings.layout;
        const myLayout = new GoldenLayout({
            settings: {
                showPopoutIcon: false,
                showCloseIcon: false
            },
            content
        }, this.refs.layout);

        // TODO: results, cc instances, user instances, footer bar, verboselogs
        [Log, SingleView, Editor].forEach(item => {
            const Component = (item.connect && item.connect()) || item;
            myLayout.registerComponent(item.name, class extends React.Component {
                render () {
                    return (
                        <Provider store={store}>
                            <Component {...this.props} />
                        </Provider>
                    )
                }
            });
        });

        myLayout.init();
        window.addEventListener('resize', () =>
            myLayout.updateSize(this.refs.layout.offsetWidth, this.refs.layout.offsetHeight));
    }

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                <div ref="layout" style={{ flex: 1, overflow: 'hidden' }}></div>
                <div ref="footer" style={{ fontFamily: 'monospace', lineHeight: '30px', height: '30px', overflow: 'hidden', backgroundColor: 'black', color: 'white' }}>{this.props.status.connected ? '[OK]' : '[TRYING]'}: {this.props.status.message}</div>
            </div>
        )
    }

}

export default connect(state => ({ status: state.status }))(App);
