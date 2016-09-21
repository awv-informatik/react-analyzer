import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { apply as jsonPatch } from 'fast-json-patch';
import cloneDeep from 'lodash/cloneDeep';
import throttle from 'lodash/throttle';
import SocketIO from 'awv3/communication/socketio';
import { url as getUrl} from 'awv3/core/helpers';
import escapeStringRegexp from 'escape-string-regexp';

const SET_URL = 'SET_URL';
const SET_FILTER = 'SET_FILTER';
const SET_EDITOR_TEXT = 'SET_EDITOR_TEXT';
const ADD_LOG = 'ADD_LOG';
const ADD_LOGS = 'ADD_LOGS';
const SET_CONNECTED = 'SET_CONNECTED';
const NOTIFY = 'NOTIFY';
const PATCH = 'PATCH';

const settings = (state = {}, action) => {
    switch (action.type) {
        case SET_URL:
            return { ...state, url: action.url };
        case SET_FILTER:
            return { ...state, filter: escapeStringRegexp(action.filter) };
        case SET_EDITOR_TEXT:
            return { ...state, editorText: action.editorText };
        default:
            return state;
    }
};

const log = (state = [], action) => {
    switch (action.type) {
        case ADD_LOG:
            return [ ...state, action.object ];
        case ADD_LOGS:
            return [ ...state, ...action.objects ];
        default:
            return state;
    }
};

const internal = (state = {}, action) => {
    switch (action.type) {
        case PATCH:
            let stats = state.stats;
            let graph = stats.graph;

            if (action.delta.patch) {
                state = cloneDeep(state);
                jsonPatch(state, action.delta.patch);
            } else {
                state = action.delta;
            }

            let sessions = state.sessions.length;
            let analyzers = state.analyzers.length;
            let busy = state.sessions.reduce((prev, cur) => prev + cur.tasks.length, 0);
            let users = state.users.length;
            let queue = state.queue.length;
            let peak = Math.max(stats.peak, queue);
            if (queue === 0 && peak > 1)
                peak = peak - 1;

            // Update graph
            let timestamp = stats.timestamp;
            let now = Date.now();
            if (now - timestamp > 1000) {
                timestamp = now;
                graph = [ ...stats.graph.slice(-49), queue ];
            }

            return {
                ...state,
                stats: { sessions, busy, users, analyzers, queue, peak, graph, timestamp }
            };

        default:
            return state;
    }
}

const status = (state = {}, action) => {
    switch (action.type) {
        case SET_CONNECTED:
            return { ...state, connected: action.connected };
        case NOTIFY:
            return { ...state, message: action.message };
        default:
            return state;
    }
};

const localState = {
    status: {
        url: getUrl("url") || (document.location.hostname == 'localhost' ? 'http://localhost:8181' : `${window.location.protocol}//${document.location.hostname}`),
        connected: false,
        message: ""
    },
    settings: {
        templates: {
            javascript: require("raw!../assets/template.txt")
        },
        filter: "",
        editorText: ""
    },
    internal: {
        stats: {
            peak: 1,
            sessions: 0,
            busy: 0,
            users: 0,
            analyzers: 0,
            queue: 0,
            graph: new Array(50).fill(0),
            timestamp: Date.now()
        }
    },
    log: []
};

// Get state local storage, if any
try {
    let state = localStorage.getItem('SETTINGS');
    if (state !== null) {
        localState.settings = JSON.parse(state);
    }
} catch(e) { /* ... */ }

// Expose store and actions
export const store = createStore(combineReducers({ settings, log, status, internal, routing }), localState, window.devToolsExtension && window.devToolsExtension());

export const setUrl = url => ({ type: SET_URL, url });
export const setEditorText = editorText => ({ type: SET_EDITOR_TEXT, editorText });
export const addLog = object => ({ type: ADD_LOG, object });
export const addLogs = objects => ({ type: ADD_LOGS, objects });
export const notify = message => ({ type: NOTIFY, message });
export const setConnected = connected => ({ type: SET_CONNECTED, connected });
export const patch = delta => ({ type: PATCH, delta });

class Analyzer extends SocketIO {
    constructor() {
        super({ debug: true, credentials: [] });

        this.messages = [];
        this.patches = [];

        this.on('connected', (socket, data) => {
            store.dispatch(patch(data.tree));
            store.dispatch(setConnected(true));
            store.dispatch(notify(store.getState().settings.url));

            this.socket.on('debug', data => {
                SocketIO._ack(this.socket);
                switch(data.type) {
                    case 'message':
                        if (data.message.indexOf("\n") > 0) {
                            let items = data.message.split("\n")
                                .filter(item => item.trim().length > 0 && !item.startsWith('Execute'))
                                .map(item => ({ ...data, message: item }));
                            this.messages = this.messages.concat(items);
                        } else {
                            this.messages.push(data);
                        }
                        break;
                    case 'patch':
                        this.patches.push(data);
                        break;
                }
                this.update();
            });
        });

        this.on('disconnected', socket => {
            store.dispatch(setConnected(false));
            this.update();
        });

        this.on('error', reason => {
            store.dispatch(setConnected(false));
            store.dispatch(notify(reason.message))
            this.update();
        });
    }

    update = throttle(() => {
        this.messages.length > 0 && store.dispatch(addLogs(this.messages));
        this.patches.length > 0 && this.patches.forEach(patchSet => store.dispatch(patch(patchSet)));
        this.patches = [];
        this.messages = [];
    }, store.getState().internal.stats.queue > 10 ? 500 : 50);
}

let url = store.getState().status.url;
export const analyzer = new Analyzer();
analyzer.connect(url).catch( reason => store.dispatch(notify(reason.message)));
