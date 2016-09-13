import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { RouteTransition } from 'react-router-transition';

@connect(state => ({
    status: state.status,
    filter: state.settings.filter ,
    queue: state.internal.queue,
    users: state.internal.users,
    sessions: state.internal.sessions,
    analyzers: state.internal.analyzers,
    log: state.log
}))
class Footer extends React.Component {
    static propTypes = {
        queue: React.PropTypes.array,
        users: React.PropTypes.array,
        analyzers: React.PropTypes.array,
        sessions: React.PropTypes.array,
        log: React.PropTypes.array
    }

    static defaultProps = {
        queue: [],
        users: [],
        analyzers: [],
        sessions: [],
        log: []
    }

    render() {

        let sessions = this.props.sessions.length;
        let busy = this.props.sessions.reduce((prev, cur) => prev + cur.tasks.length, 0);
        let users = this.props.users.length;
        let queue = this.props.queue.length;
        let valueQueue = Math.round((Math.min(1, queue / users) || 0 ) * 100);
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

@connect(state => ({ filter: state.settings.filter }))
export default class extends React.Component{
    render() {
        return (
            <main style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>

                <main style={{ display: 'flex', width: '100%', height: '100%' }}>

                    <aside style={{ width: 100 }} />

                    <nav style={{ minWidth: 200 }}>

                        <div style={{ position: 'fixed', top: 120 }}>

                            <h1 style={{ position: 'absolute', top: -50, color: '#64a8db', fontSize: 30, fontWeight: 600 }}>
                                <i className="cube icon"></i>AWV<span style={{ color: '#51586a' }}>NODE</span>
                            </h1>

                            <div className="ui icon input" style={{ marginBottom: 20 }}>
                                <input type="text" placeholder="Search..." value={this.props.filter} onChange={e =>
                                    this.props.dispatch({ type: 'SET_FILTER', filter: e.target.value })}/>
                                <i className="search icon"></i>
                            </div>

                            <div className="ui secondary vertical menu">
                                <Link to="/overview" className="item" activeClassName="active blue">Overview</Link>
                                <Link to="/log" className="item" activeClassName="active blue">Logs</Link>
                                <Link to="/editor" className="item" activeClassName="active blue">Editor</Link>
                            </div>

                        </div>

                    </nav>

                    <section style={{ position: 'relative', flex: 1, height: '100%', width: '100%', marginLeft: 100 }}>

                        <RouteTransition
                            style={{ height: '100%', width: '100%' }}
                            pathname={this.props.location.pathname}
                            atEnter={{ opacity: 0, translateY: 10 }}
                            atLeave={{ opacity: 0, translateY: -10 }}
                            atActive={{ opacity: 1, translateY: 0 }} >
                            {this.props.children}
                        </RouteTransition>

                    </section>

                </main>

                <Footer />

            </main>
        );
    }
}
