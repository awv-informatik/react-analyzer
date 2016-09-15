import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider, connect } from 'react-redux'
import { store } from './store/store';

import App from './pages/App';
import Overview from './pages/Overview';
import Log from './pages/Log';
import Editor from './pages/Editor';

ReactDOM.render((
    <Provider store={store}>
        <Router history={syncHistoryWithStore(browserHistory, store)}>
            <Route path="/" component={App}>
                <IndexRoute component={Overview} />
                <Route path="/overview" component={Overview} />
                <Route path="/log" component={Log} />
                <Route path="/editor" component={Editor} />
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'));
