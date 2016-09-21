import React from 'react';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';
import 'brace/mode/jsx';
import 'brace/theme/xcode';
import { actions } from '../store/reducers';

@connect()
export default class Editor extends React.Component {
    state = { label: "[ CTRL - S ] to compile", icon: "large info icon", color: "#64a8db", error: false }

    componentDidMount() {
        window.addEventListener("keydown", this.listen);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.listen);
    }

    listen = async (event) => {
        if (event.ctrlKey && event.keyCode == 83) {
            event.preventDefault();

            let timeout;
            try {

                // Get code from editor and compile using eval
                let value = this.refs.ace.editor.getValue();
                this.props.dispatch(actions.setEditorText(value));

                // When Babel is available, let's translate the code
                if (typeof Babel !== 'undefined') {
                    value = `(async () => { ${value} })()`;
                    value = Babel.transform(value, { presets: ['es2015', 'stage-0'] }).code;
                }

                // Evaluate code and notify
                let promise = eval(value);
                this.notify({ error: false, label: "compiled successfully", icon: "large check icon", color: "#11cc77" });
                this.props.onSaved && this.props.onSaved(value);

                // Await promise so it can be catched
                await promise;

            } catch (reason) {
                this.notify({ error: true, label: reason.message, icon: "large remove icon", color: "#D81B60" }, 4000);
            }
        }
    }

    notify(state, reset = 2000) {
        this.timeout && clearTimeout(this.timeout)
        this.setState(state);
        this.timeout = setTimeout(() =>
            this.setState({ color: "#64a8db", error: false }), reset);
    }

    render() {
        return (
            <div style={styles.editor}>

                <AceEditor
                    ref="ace" name="randomname" mode="jsx" theme="xcode"
                    editorProps={{ $blockScrolling: true }}
                    height="100%" width="100%"
                    value={ this.props.text }
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

                <div style={{ ...styles.editorHandle, height: this.state.error ? 200 : 40, backgroundColor: this.state.color }}>
                    <i className={this.state.icon} />
                    <span style={{ marginLeft: 10 }}>{this.state.label}</span>
                </div>
            </div>
        );
    }
}

const styles = {
    editor: { display: 'flex', flexDirection: 'column', width: '100%', height: 'calc(100vh - 60px)' },
    editorHandle: { display: 'flex', alignItems: 'center', paddingLeft: 50, fontSize: 14, fontWeight: 'bold', color: 'white', transition: 'background-color, height .5s', borderTop: '1px #b5b5b5 solid', whiteSpace: 'pre', fontFamily: 'monospace' }
 }
