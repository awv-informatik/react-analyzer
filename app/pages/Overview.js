import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Load from '../components/Load';
import Graph from 'react-graph-bars';
import Stat from 'rebass/dist/Stat';

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

        // Generate graph data
        let currentGraph = graph.map(item => {
            item = peak > 0 ? 1 - item / peak : 1;
            if (item < 0) item = 0;
            if (item > 1) item = 1;
            return item;
        });

        return (
            <div style={{ ...styles.container, ...this.props.styles }}>
                <div style={styles.flexHorizontal}>
                    <div style={styles.flexVertical}>
                        <div style={{ display: 'flex' }}>
                            <Load size={200} style={{ marginRight: 50 }}>
                                <span style={styles.tag}>Tasks</span>
                            </Load>
                            <Load size={200} calc={({ sessions, users, queue }) => queue / sessions}>
                                <span style={styles.tag}>Load</span>
                            </Load>
                        </div>
                        <Graph name="graph" data={currentGraph} minColor="#edf8f3" maxColor="#E53935" />
                        <span style={{ marginTop: 10 }}>Tasks</span>
                    </div>
                    <ul style={styles.list}>
                        <li><Stat unit="Sessions" label=" running" value={sessions} style={styles.stat} /></li>
                        <li><Stat unit="Users" label=" active" value={users} style={styles.stat} /></li>
                        <li><Stat unit="Tasks" label=" queued" value={queue} style={styles.stat} /></li>
                    </ul>
                </div>
            </div>
        )
    }
}

const styles = {
    container: { position: 'absolute', marginTop: 74, display: 'flex', flexDirection: 'column', height: '100%' },
    flexHorizontal: { display: 'flex', paddingBottom: 174, color: 'white', height: '100%', color: '#d4d2d2' },
    flexVertical: { display: 'flex', flexDirection: 'column' },
    tag: { position: 'absolute', bottom: -10 },
    list: { listStyle: 'none', marginLeft: 100, borderLeft: '4px #efefef solid', height: '100%' },
    stat: { color: '#8c8c8c', paddingBottom: 15 }
}
