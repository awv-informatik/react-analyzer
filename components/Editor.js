import React from 'react';
import { connect } from 'react-redux'
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night';
import { v4 } from 'node-uuid';

export default class Editor extends React.Component {
    componentDidMount() {
        this.props.glContainer && this.props.glContainer.on('resize', () => this.refs.ace.editor.resize());
    }
    render() {
        return (
            <AceEditor
                ref="ace"
                name={v4()}
                mode="javascript"
                theme="tomorrow_night"
                editorProps={{$blockScrolling: true}}
                height="100%"
                width="100%"
                value={this.props.template}
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
        )
    }

    static connect() {
        return connect(state => ({ template: state.settings.template }))(Editor);
    }
}
