import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider, connect } from 'react-redux'
import { store } from './assets/store';

import App from './containers/App';
import Overview from './containers/Overview';
import Log from './containers/Log';
import Editor from './containers/Editor';

ReactDOM.render((
    <Provider store={store}>
        <Router history={syncHistoryWithStore(hashHistory, store)}>
            <Route path="/" component={App}>
                <IndexRoute component={Overview} />
                <Route path="/overview" component={Overview} />
                <Route path="/log" component={Log} />
                <Route path="/editor" component={Editor} />
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'));
