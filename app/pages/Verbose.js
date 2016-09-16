import React from 'react';
import { connect } from 'react-redux';
import { analyzer } from '../store/store';

@connect(state => ({ sessions: state.internal.sessions, filter: state.settings.filter, url: state.status.url }))
export default class Verbose extends React.Component {

    constructor() {
        super();
        this.state = { log: "" };
    }

    setFilter = (filter) =>
        this.props.dispatch({ type: 'SET_FILTER', filter });

    async click(classcad) {
        let { firstResult } = await analyzer.request({ command: 'Execute', task: 'RETURN CADH_GetVerboseFileContent();' }, { classcad });
        this.setState({ log: firstResult });
    }

    render() {

        let { sessions, filter } = this.props;
        let filteredSessions;
        if (sessions) {
            let filterExp = new RegExp(filter, "i");
            filteredSessions = sessions.filter(item => filterExp.test(item.id));
        }

        console.log(filteredSessions)

        return (
            <div style={styles.wrapper}>
                <ul style={{ margin: 0, marginTop: 74, paddingRight: 50, paddingLeft: 0, listStyle: 'none' }}>
                    {filteredSessions && filteredSessions.map(session =>
                        <li key={session.id} className={`item classcad color-${session.color}-600`} onClick={() => this.click(session.id)}>
                            {session.id}
                        </li>)}
                </ul>
                <pre style={{ flex: 1, position: 'relative', overflowY: 'auto', overflowX: 'hidden', outline: 'none', color: '#777', fontFamily: 'monospace', margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word', paddingRight: 100 }}>
                    <div style={{ height: 74 }}></div>

                        {this.state.log}

                </pre>
            </div>
        );
    }
}

const styles = {
    wrapper: { position: 'absolute', width: '100%', height: '100%', display: 'flex' }
}
