import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { actions } from '../store/store';

@connect()
export default class Nav extends React.Component {
    render() {
        return (
            <nav style={styles.nav}>
                <div style={styles.wrapper}>
                    <h1 style={styles.header}>
                        <i className="cube icon"></i>AWV<span style={{ color: '#d4d2d2' }}>NODE</span>
                    </h1>
                    <div className="ui icon input" style={{ marginBottom: 20 }}>
                        <input type="text" placeholder="Search..." value={this.props.filter} onChange={e =>
                            this.props.dispatch(actions.setFilter(e.target.value))}/>
                        <i className="search icon"></i>
                    </div>
                    <div className="ui secondary vertical menu">
                        <Link to="/overview" className="item" activeClassName="active blue">Overview</Link>
                        <Link to="/logs" className="item" activeClassName="active blue">Logs</Link>
                        <Link to="/proto" className="item" activeClassName="active blue">Prototyping</Link>
                        <Link to="/verbose" className="item" activeClassName="active blue">Verbose</Link>
                    </div>
                </div>
            </nav>
        )
    }
}

const styles = {
    nav: { minWidth: 200 },
    wrapper: { position: 'fixed', top: 120 },
    header: { position: 'absolute', top: -50, color: '#64a8db', fontSize: 30, fontWeight: 600 }
}
