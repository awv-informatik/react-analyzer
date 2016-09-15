import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

@connect()
export default class Nav extends React.Component {
    render() {
        return (
            <nav style={{ minWidth: 200 }}>

                <div style={{ position: 'fixed', top: 120 }}>

                    <h1 style={{ position: 'absolute', top: -50, color: '#64a8db', fontSize: 30, fontWeight: 600 }}>
                        <i className="cube icon"></i>AWV<span style={{ color: '#d4d2d2' }}>NODE</span>
                    </h1>

                    <div className="ui icon input" style={{ marginBottom: 20 }}>
                        <input type="text" placeholder="Search..." value={this.props.filter} onChange={e =>
                            this.props.dispatch({ type: 'SET_FILTER', filter: e.target.value })}/>
                        <i className="search icon"></i>
                    </div>

                    <div className="ui secondary vertical menu">
                        <Link to="/overview" className="item" activeClassName="active blue">Overview</Link>
                        <Link to="/logs" className="item" activeClassName="active blue">Logs</Link>
                        <Link to="/proto" className="item" activeClassName="active blue">Prototyping</Link>
                    </div>

                </div>

            </nav>
        )
    }
}
