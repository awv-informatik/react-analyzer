import React from 'react';
import { connect } from 'react-redux';
import { analyzer } from '../store/analyzer';

@connect()
export default class Verbose extends React.Component {
    state = { log: "" };

    async componentWillMount() {
        let { firstResult } = await analyzer.request({ command: 'Execute', task: 'RETURN CADH_GetVerboseFileContent();' }, { classcad: this.props.params.id });
        this.setState({ log: firstResult });
    }

    render() {
        return (
            <div style={styles.wrapper}>
                <pre style={styles.pre}>
                    <div style={{ height: 74 }}></div>
                    {this.state.log}
                </pre>
            </div>
        );
    }
}

const styles = {
    wrapper: { position: 'absolute', width: '100%', height: '100%', display: 'flex' },
    pre: { flex: 1, position: 'relative', overflowY: 'auto', overflowX: 'hidden', outline: 'none', color: '#777', fontFamily: 'monospace', margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word', paddingRight: 100 }
}
