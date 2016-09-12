import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import { store } from '../store';

import GoldenLayout from 'golden-layout';
import SingleView from '../components/SingleView';
import Log from '../components/Log';
import Editor from '../components/Editor';
import Cluster from '../components/Cluster';

// Golden layout React work-around
const wrap = (Component, mapStateToProps) => {
    Component = connect(mapStateToProps)(Component);
    return class extends React.Component {
        render () {
            return (
                <Provider store={store}>
                    <Component {...this.props} />
                </Provider>
            )
        }
    }
}

@connect(state => ({ status: state.status }))
export default class App extends React.Component {

    componentDidMount() {

        let content = store.getState().settings.layout;
        const myLayout = new GoldenLayout({
            settings: {
                showPopoutIcon: false,
                showCloseIcon: false
            },
            content
        }, this.refs.layout);

        // Register components and connect them to the store,
        // Mapping relevent store-attributes to component properties
        myLayout.registerComponent("Log", wrap(Log, state => ({ lines: state.log })));
        myLayout.registerComponent("UsersCluster", wrap(Cluster, state => ({ source: state.internal.users })));
        myLayout.registerComponent("SessionsCluster", wrap(Cluster, state => ({ source: state.internal.sessions })));
        myLayout.registerComponent("TasksCluster", wrap(Cluster, state => ({ source: state.internal.tasks })));
        myLayout.registerComponent("QueueCluster", wrap(Cluster, state => ({ source: state.internal.queue })));
        myLayout.registerComponent("JsEditor", wrap(Editor, state => ({ text: state.settings.templates.javascript })));
        myLayout.registerComponent("CcEditor", wrap(Editor, state => ({ text: state.settings.templates.classcad })));
        myLayout.registerComponent("View", SingleView);

        myLayout.init();

        window.addEventListener('resize', () =>
            myLayout.updateSize(this.refs.layout.offsetWidth, this.refs.layout.offsetHeight));
    }

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                <div style={{ flex: 1, overflow: 'hidden' }} ref="layout"></div>
                <div style={{ fontFamily: "'BlinkMacSystemFont', 'Lucida Grande', 'Segoe UI', Ubuntu, Cantarell, sans-serif", lineHeight: '30px', fontSize: '11px', sheight: '30px', overflow: 'hidden', backgroundColor: 'black', color: '#9da5b4', paddingLeft: '10px' }}>{this.props.status.connected ? '[OK]' : '[TRYING]'}: {this.props.status.message}</div>
            </div>
        )
    }

}

//export default connect(state => ({ status: state.status }))(App);
