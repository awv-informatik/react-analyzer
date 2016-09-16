import React from 'react';
import { connect } from 'react-redux';
import LogItem from '../components/LogItem';

@connect(state => ({
    status: state.status,
    queue: state.internal.stats.queue,
    sessions: state.internal.stats.sessions,
    users: state.internal.stats.users,
    peak: state.internal.stats.peak,
    log: state.log
}))
export default class Footer extends React.Component {
    render() {
        let { sessions, queue, peak, users, status, log } = this.props;
        let valueQueue = Math.round((Math.min(1, queue / peak) || 0 ) * 100);
        let valueLoad = Math.round((Math.min(1, queue / sessions) || 0 )  * 100);
        log = log && log[log.length - 1];

        return (
            <footer>
                <a className="ui image label">
                    <img src="http://semantic-ui.com/images/avatar/small/christian.jpg" /> Admin
                </a>
                <i className={ `${status.connected ? "green check" : "pink remove"} large icon` } />
                <span>{status.url}</span><span>{status.message}</span>
                <i className="blue large loading circle notched icon" />
                { log ?
                    <LogItem wrap={false} {...log} style={styles.log} /> :
                    <span style={styles.log} />
                }
                <div style={styles.status}>
                    <div style={{ flex: 1 }}><i className="grey large sitemap icon" /> {sessions}</div>
                    <div style={{ flex: 1 }}><i className="grey large users icon" /> {users}</div>
                    <div style={{ flex: 1 }}><i className="grey large tasks icon" /> {queue}</div>
                    <div style={{ flex: 1, color: '#2185D0' }}><i className="blue large cloud download icon" /> {valueLoad} %</div>
                    <div style={{ flex: 1, color: '#2185D0' }}><i className="blue large wait icon" /> {valueQueue} %</div>
                </div>
            </footer>
        )
    }
}

const styles = {
    log: { flex: 1, height: 19.5, overflow: 'hidden', paddingRight: 20 },
    status: { flex: 1, display: 'flex', maxWidth: 400, alignItems: 'stretch' }
}
