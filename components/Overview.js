import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Load from '../components/Load';
import Stat from '../components/Stat';

@connect(state => ({
    status: state.status,
    queue: state.internal.stats.queue,
    sessions: state.internal.stats.sessions,
    users: state.internal.stats.users,
}))
export default class Overview extends React.Component {

    render() {
        let { sessions, queue, users } = this.props;
        return (
            <div style={{ position: 'absolute', marginTop: 74, display: 'flex', flexDirection: 'column', height: '100%', ...this.props.styles }}>
                <div style={{ display: 'flex', paddingBottom: 174, color: 'white', height: '100%' }}>

                    <Load size={200} style={{ marginRight: 50 }} />
                    <Load size={200} calc={({ sessions, users, queue }) => queue / sessions} />

                    <ul style={{ listStyle: 'none', marginLeft: 100, borderLeft: '4px #efefef solid', height: '100%' }}>
                        <li><Stat name="Sessions" label="running" value={sessions} /></li>
                        <li><Stat name="Users" label="active" value={users} /></li>
                        <li><Stat name="Tasks" label="queued" value={queue} /></li>
                    </ul>
                </div>

            </div>
        )
    }

}
