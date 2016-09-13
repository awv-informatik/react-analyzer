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

@connect(state => ({ status: state.status }))
export default class Overview extends React.Component {

    render() {
        return (
            <div style={{ position: 'absolute', marginTop: 74, display: 'flex', flexDirection: 'column', ...this.props.styles }}>
                <div style={{ display: 'flex', paddingBottom: 100, color: 'white' }}>

                    <Load size={200} style={{ marginRight: 50 }} />
                    <Load size={200} calc={(sessions, users, queue) => queue / sessions} />

                    <ul style={{ listStyle: 'none', marginLeft: 100, borderLeft: '4px #efefef solid' }}>
                        <li><SessionStat name="Sessions" label="running" /></li>
                        <li><UserStat name="Users" label="active" /></li>
                        <li><QueueStat name="Tasks" label="queued"/></li>
                    </ul>
                </div>

            </div>
        )
    }

}
