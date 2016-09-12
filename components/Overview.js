import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Load from '../components/Load';
import Log from '../components/Log';
import Stat from '../components/Stat';

// Map store-state to properties
const SessionStat = connect(state => ({ source: state.internal.sessions}))(Stat);
const UserStat = connect(state => ({ source: state.internal.users }))(Stat);
const QueueStat = connect(state => ({ source: state.internal.queue }))(Stat);
const LiveLog = connect(state => ({ lines: state.log }))(Log);
const LiveLoad = connect(state => ({
    queue: state.internal.queue,
    users: state.internal.users,
    sessions: state.internal.sessions,
    analyzers: state.internal.analyzers
}))(Load);

@connect(state => ({ status: state.status }))
export default class App extends React.Component {

    render() {
        return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', paddingBottom: 100 }}>
                    <LiveLoad />

                    <ul style={{ listStyle: 'none', marginLeft: 120, borderLeft: '4px #E53935 solid' }}>
                        <li><SessionStat name="Sessions" label="running" /></li>
                        <li><UserStat name="Users" label="active" /></li>
                        <li><QueueStat name="Tasks" label="queued"/></li>
                    </ul>
                </div>

            </div>
        )
    }

}
