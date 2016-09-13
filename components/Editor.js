import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/jsx';
import 'brace/theme/xcode';
import { animateScroll, Link } from 'react-scroll';

import { store } from '../store';

import Presentation from '../assets/presentation';
import Object3 from 'awv3/three/object3';
import SocketIO from 'awv3/communication/socketio';
import Rest from 'awv3/communication/rest';

import Canvas from '../components/Canvas';
import View from '../components/View';
import JSONTree from 'react-json-tree'

export default class Editor extends React.Component {
    static propTypes = {
        text: React.PropTypes.string
    }

    static defaultProps = {
        text: ""
    }

    constructor() {
        super();
        this.state = {
            target: "view",
            editorLabel: "Press [ CTRL - S ] to compile",
            editorLabelIcon: "large info icon",
            editorLabelBg: "#64a8db",
            editorError: false,
            resultsUp: false,
            results: []
        };
    }

    toggle = () => {
        this.setState({ target: this.state.target === "view" ? "top" : "view" });
        this.refs.icon.classList.toggle('rotate');
    }

    toggleResults = () => {
        this.setState({
            resultsUp: !this.state.resultsUp
        });
    }

    listen = async (e) => {

        if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();

            let timeout;
            try {

                // Get code from editor and compile using eval
                let value = this.refs.ace.editor.getValue();

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
                    this.toggle();
                    this.view.canvas.renderer.resize();
                    animateScroll.scrollToBottom({ containerId: 'container' });
                    setTimeout(() => this.setState({ editorLabelBg: "#64a8db", editorError: false }), 1000);
                }, 500);

                await promise;
                //localStorage.setItem(state.storageKey, value);

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

    async componentDidMount() {

        window.addEventListener("keydown", this.listen);

        let view = this.view = this.refs.view.viewImpl;

        window.SocketIO = SocketIO;
        window.Rest = Rest;
        window.Object3 = Object3;
        window.Presentation = Presentation;
        window.view = view;

        window.clear = () => {
            view.scene.destroy();
            window.presenter = new Presentation();
            window.view.scene.add(window.presenter);
            this.setState({ results: [] });
        };

        window.show = (models) => {
            window.presenter.add(models);
            window.view.controls.focus().zoom();
        };

        window.results = (results) => {

            if (!Array.isArray(results))
                results = [results];

            this.setState({ results: results.map(item => item.result) });
        }

        window.canvas = view.canvas;
        window.view = view;
        window.log = {
            start: () => console.log("start"),
            stop: () => console.log("stop"),
            printResults: () => console.log("printResults")
        }
        window.url = store.getState().settings.url;

    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.listen);
    }

    render() {
        return (
            <div id="container" style={{ position: 'absolute',  width: '100%', height: '100%', overflow: 'hidden' }}>

                <div id="top" style={{ display: 'flex', width: '100%', height: '100%' }}>

                    <div style={{ flex: 1, height: '100%' }}>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                            <AceEditor
                                ref="ace"
                                name={"ace"}
                                mode="jsx"
                                theme="xcode"
                                editorProps={{$blockScrolling: true}}
                                height="100%"
                                width="100%"
                                value={this.props.text}
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
                                }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 50, height: this.state.editorError ? 200 : 40, backgroundColor: this.state.editorLabelBg, fontSize: 14, fontWeight: 'bold', color: 'white', transition: 'background-color, height 1s', borderTop: '1px #b5b5b5 solid', whiteSpace: 'pre', fontFamily: 'monospace' }}>
                                <i className={this.state.editorLabelIcon} />
                                <span style={{ marginLeft: 10 }}>{this.state.editorLabel}</span>
                            </div>
                        </div>

                        <div id="view" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>

                            <Canvas style={{ backgroundColor: '#efefef', position: 'relative', height: '100%', width: '100%' }}>
                                <View ref="view" up={ [0, 1, 0] } />
                            </Canvas>

                            <div className="results" style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#dfdfdf',
                                transform: `translate3d(0,${ this.state.resultsUp ? '0' : 'calc(100% - 40px)' },0)`,
                                transition: 'transform .5s' }}>

                                <div ref="results-handle" style={{
                                    display: 'flex', alignItems: 'center', paddingLeft: 50, height: 40, fontSize: 14, fontWeight: 'bold',
                                    color: 'white', transition: 'background-color 1s', cursor: 'pointer',
                                    borderTop: '1px #b5b5b5 solid', backgroundColor: this.state.results.length > 0 ? '#11cc77' : '#c6c6c6' }} onClick={this.toggleResults}>

                                    <i className={`large ${this.state.resultsUp ? 'rotate' : ''} chevron up icon`} style={{ transition: 'transform .2s'}}/>
                                    <span style={{ marginLeft: 10 }}>Results</span>

                                </div>

                                <JSONTree data={this.state.results} />

                            </div>

                        </div>

                    </div>

                </div>

                <sidebar style={{ position: 'fixed', top: 74, right: 40, color: 'white', cursor: 'pointer' }}>
                    <Link to={this.state.target} containerId="container" smooth={true} duration={500} onClick={this.toggle}>
                        <i ref="icon" className="big link chevron down icon" style={{ transition: 'transform .2s'}} />
                    </Link>
                </sidebar>

            </div>
        )
    }
}
