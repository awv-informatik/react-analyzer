import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { RouteTransition } from 'react-router-transition';

import Nav from '../components/Nav';
import Footer from '../components/Footer';

@connect(state => ({ filter: state.settings.filter }))
export default class extends React.Component{
    render() {
        return (
            <main style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                    <aside style={{ width: 100 }} />
                    <Nav {...this.props} />
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
                </div>
                <Footer />
            </main>
        );
    }
}
