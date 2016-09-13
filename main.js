import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider, connect } from 'react-redux'
import { store } from './store';

import Navigation from './components/Navigation';
import Overview from './components/Overview';
import Log from './components/Log';
import Editor from './components/Editor';

const LiveLog = connect(state => ({
    lines: state.log,
    filter: state.settings.filter
}))(Log);

const LiveEditor = connect(state => ({ text: state.settings.templates.javascript }))(Editor);

ReactDOM.render((
    <Provider store={store}>
        <Router history={syncHistoryWithStore(hashHistory, store)}>
            <Route path="/" component={Navigation}>
                <IndexRoute component={Overview} />
                <Route path="/overview" component={Overview} />
                <Route path="/log" component={LiveLog} />
                <Route path="/editor" component={LiveEditor} />
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'));
