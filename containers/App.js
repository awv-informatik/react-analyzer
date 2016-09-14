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
            <main style={style.main}>
                <div style={style.wrapper}>
                    <aside style={style.aside} />
                    <Nav {...this.props} />
                    <aside style={style.aside} />
                    <section style={style.section}>
                        <RouteTransition
                            style={stretch}
                            pathname={this.props.location.pathname}
                            atEnter={{ opacity: 0, translateY: 10 }}
                            atLeave={{ opacity: 0, translateY: -10 }}
                            atActive={{ opacity: 1, translateY: 0 }} >

                            {/* Children are injected by router */}
                            {this.props.children}

                        </RouteTransition>
                    </section>
                </div>
                <Footer />
            </main>
        );
    }
}

const stretch = { height: '100%', width: '100%' };
const style = {
    aside: { width: 100 },
    main: { display: 'flex', flexDirection: 'column', ...stretch },
    wrapper: { display: 'flex', ...stretch },
    section: { position: 'relative', flex: 1, ...stretch }
}
