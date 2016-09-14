import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { RouteTransition } from 'react-router-transition';
import Footer from '../components/Footer';

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
                                <i className="cube icon"></i>AWV<span style={{ color: '#d4d2d2' }}>NODE</span>
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

                    <aside style={{ width: 100 }} />

                    <section style={{ position: 'relative', flex: 1, height: '100%', width: '100%' }}>

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
