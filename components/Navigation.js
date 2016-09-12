import React from 'react';
import { Link } from 'react-router';

export default class Navigation extends React.Component {
    render() {
        return (
            <nav style={{ height: '100%', width: '100%', overflowX: 'hidden', overflowY: 'scroll' }}>

                <div className="ui container" style={{ display: 'flex', minHeight: '100%' }}>

                    <sidebar style={{ minWidth: 200 }}>

                        <div style={{ position: 'fixed', top: 120 }}>

                            <h1 style={{ position: 'absolute', top: -50, color: 'white', fontSize: 30, fontWeight: 600 }}>
                                <i className="cube icon"></i>AWV<span style={{ color: '#51586a' }}>NODE</span>
                            </h1>

                            <div className="ui icon input" style={{ marginBottom: 20 }}>
                                <input type="text" placeholder="Search..." />
                                <i className="search icon"></i>
                            </div>

                            <div className="ui secondary vertical inverted menu">
                                <Link to="/overview" className="item" activeClassName="active blue">Overview</Link>
                                <Link to="/log" className="item" activeClassName="active blue">Logs</Link>
                                <Link to="/editor" className="item" activeClassName="active blue">Editor</Link>
                                <Link to="/verbose" className="item" activeClassName="active blue">Verbose</Link>
                            </div>

                        </div>

                    </sidebar>

                    <div style={{ flex: 1, position: 'relative', height: '100%', width: '100%', marginLeft: 120, marginTop: 74 }}>
                        {this.props.children}
                    </div>

                </div>

            </nav>
        )
    }
}
