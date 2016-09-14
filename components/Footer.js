import React from 'react';
import { connect } from 'react-redux';

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

        let { sessions, queue, peak, users } = this.props;
        let valueQueue = Math.round((Math.min(1, queue / peak) || 0 ) * 100);
        let valueLoad = Math.round((Math.min(1, queue / sessions) || 0 )  * 100);
        let log = this.props.log[this.props.log.length -1];

        return (
            <footer>
                <a className="ui image label">
                    <img src="http://semantic-ui.com/images/avatar/small/christian.jpg" />
                    Admin
                </a>
                {this.props.status.connected ?
                    <i className="green large check icon" /> :
                    <i className="large pink remove icon" />
                }
                <span>{this.props.status.message}</span>

                <i className="blue large loading circle notched icon" />

                <div style={{ flex: 1, textTransform: 'uppercase', height: 19.5, overflow: 'hidden' }}>
                    { log && <span className="log">
                    CCD{log.classcad.key.substr(0, 8)} USR{log.user.key.substr(0, 8)} {log.sign} {log.message}
                    </span> }
                </div>

                <div style={{ flex: 1, display: 'flex', maxWidth: 400, alignItems: 'stretch' }}>
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
