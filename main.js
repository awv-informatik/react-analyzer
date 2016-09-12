import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory  } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider, connect } from 'react-redux'
import { store } from './store';

import Overview from './components/Overview';
import Log from './components/Log';
import Navigation from './components/Navigation';

const LiveLog = connect(state => ({ lines: state.log }))(Log);

ReactDOM.render((
    <Provider store={store}>
        <Router history={syncHistoryWithStore(browserHistory, store)}>
            <Route path="/" component={Navigation}>
                <IndexRoute component={Overview} />
                <Route path="/overview" component={Overview} />
                <Route path="/log" component={LiveLog} />
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'));
