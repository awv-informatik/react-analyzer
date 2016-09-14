import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Load from '../components/Load';
import Stat from '../components/Stat';
import Graph from 'react-graph-bars';

@connect(state => ({
    status: state.status,
    queue: state.internal.stats.queue,
    graph: state.internal.stats.graph,
    peak: state.internal.stats.peak,
    sessions: state.internal.stats.sessions,
    users: state.internal.stats.users,
}))
export default class Overview extends React.Component {

    constructor() {
        super();
    }

    render() {
        let { sessions, queue, peak, graph, users } = this.props;
        let currentGraph = graph.map(item => {
            item = peak > 0 ? 1 - item / peak : 1;
            if (item < 0) item = 0;
            if (item > 1) item = 1;
            return item;
        });

        return (
            <div style={{ position: 'absolute', marginTop: 74, display: 'flex', flexDirection: 'column', height: '100%', ...this.props.styles }}>
                <div style={{ display: 'flex', paddingBottom: 174, color: 'white', height: '100%', color: '#d4d2d2' }}>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex' }}>
                            <Load size={200} style={{ marginRight: 50 }}>
                                <span style={{ position: 'absolute', bottom: -10 }}>Tasks</span>
                            </Load>
                            <Load size={200} calc={({ sessions, users, queue }) => queue / sessions}>
                                <span style={{ position: 'absolute', bottom: -10 }}>Load</span>
                            </Load>
                        </div>
                        <Graph name="xxx" data={currentGraph} minColor="#edf8f3" maxColor="#E53935" />
                        <span style={{ marginTop: 10 }}>Tasks</span>
                    </div>

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
