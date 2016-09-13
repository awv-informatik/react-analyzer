import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/xcode';
import { animateScroll, Link } from 'react-scroll';

import { store } from '../store';

import Presentation from '../assets/presentation';
import Object3 from 'awv3/three/object3';
import SocketIO from 'awv3/communication/socketio';
import Rest from 'awv3/communication/rest';

import Canvas from '../components/Canvas';
import View from '../components/View';

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
            editorLabelBg: "#64a8db"
        };
    }

    toggle = () => {
        this.setState({ target: this.state.target === "view" ? "top" : "view" });
        this.refs.icon.classList.toggle('rotate');
    }

    listen = (e) => {

        if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();
            try {

                // Get code from editor and compile using eval
                let value = this.refs.ace.editor.getValue();
                eval(value);

                //localStorage.setItem(state.storageKey, value);

                this.setState({
                    editorLabel: "compiled successfully",
                    editorLabelIcon: "large check icon",
                    editorLabelBg: "#11cc77"
                });

                setTimeout(() => {
                    this.toggle();
                    this.view.canvas.renderer.resize();
                    animateScroll.scrollToBottom({ containerId: 'container' });
                }, 250);

            } catch (reason) {
                console.log(reason)
                this.setState({
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
        view.controls.noZoom = true;

        window.SocketIO = SocketIO;
        window.Rest = Rest;
        window.Object3 = Object3;
        window.Presentation = Presentation;

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
            <div id="container" style={{ position: 'absolute',  width: '100%', height: '100%', overflow: 'auto' }}>

                <div id="top" style={{ display: 'flex', width: '100%', height: '100%' }}>

                    <div style={{ flex: 1, height: '100%' }}>

                        <div style={{ width: '100%', height: '100%' }}>
                            <AceEditor
                                ref="ace"
                                name={"ace"}
                                mode="javascript"
                                theme="xcode"
                                editorProps={{$blockScrolling: true}}
                                height="calc(100% - 40px)"
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
                            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 50, height: 40, backgroundColor: this.state.editorLabelBg, fontSize: 14, fontWeight: 'bold', color: 'white', transition: 'background-color 1s' }}>
                                <i className={this.state.editorLabelIcon} />
                                <span>{this.state.editorLabel}</span>
                            </div>
                        </div>

                        <div id="view" style={{ width: '100%', height: '100%' }}>
                            <Canvas style={{ backgroundColor: '#efefef', position: 'relative', height: '100%', width: '100%' }}>
                                <View ref="view" up={ [0, 1, 0] } />
                            </Canvas>
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
