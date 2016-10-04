import { createStore, combineReducers } from 'redux';
import { createAction, createReducer } from 'redux-act';
import { apply as jsonPatch } from 'fast-json-patch';
import escapeStringRegexp from 'escape-string-regexp';
import cloneDeep from 'lodash/cloneDeep';
import initialState from '../store/initial.js';

// Export actions
export const actions = {
    setUrl: createAction("SET_URL"),
    setFilter: createAction("SET_FILTER"),
    setEditorText: createAction("SET_EDITOR_TEXT"),
    resetEditorText: createAction("RESET_EDITOR_TEXT"),
    addLog: createAction("ADD_LOG"),
    addLogs: createAction("ADD_LOGS"),
    setVerbose: createAction("SET_VERBOSE"),
    setConnected: createAction("SET_CONNECTED"),
    notify: createAction("NOTIFY"),
    patch: createAction("PATCH")
};

// Status reducer
const status = createReducer({
    [actions.setConnected]: (state, connected) => ({ ...state, connected }),
    [actions.notify]: (state, message) => ({ ...state, message }),
}, initialState.status);

// Settings reducer
const settings = createReducer({
    [actions.setUrl]: (state, url) => ({ ...state, url }),
    [actions.setFilter]: (state, payload) => ({ ...state, filter: escapeStringRegexp(payload) }),
    [actions.setEditorText]: (state, editorText) => {
        localStorage.setItem("EDITOR_TEXT", editorText)
        return { ...state, editorText };
    },
    [actions.resetEditorText]: (state) => {
        localStorage.setItem("EDITOR_TEXT", state.template)
        return { ...state, editorText: state.template };
    }
}, initialState.settings);

// Log reducer
const log = createReducer({
    [actions.setVerbose]: (state, verbose) => ({ ...state, verbose }),
    [actions.addLog]: (state, log) => ({ ...state, actions: [...state.actions, log ]}),
    [actions.addLogs]: (state, logs) => ({ ...state, actions: [...state.actions, ...logs ]})
}, initialState.log);

// Internal reducer
const internal = createReducer({
    [actions.patch]: (state, payload) => {
        let stats = state.stats;
        let graph = stats.graph;

        if (payload.patch) {
            state = cloneDeep(state);
            jsonPatch(state, payload.patch);
        } else {
            state = payload;
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
    },
}, initialState.internal);

export const reducers = combineReducers({ settings, log,  status, internal });
export const store = createStore(reducers, undefined, window.devToolsExtension && window.devToolsExtension());
