import { createAction, createReducer } from 'redux-act';
import { apply as jsonPatch } from 'fast-json-patch';
import escapeStringRegexp from 'escape-string-regexp';
import cloneDeep from 'lodash/cloneDeep';
import { url as getUrl} from 'awv3/core/helpers';

const setUrl = createAction("SET_URL");
const setFilter = createAction("SET_FILTER");
const setEditorText = createAction("SET_EDITOR_TEXT");
const addLog = createAction("ADD_LOG");
const addLogs = createAction("ADD_LOGS");
const setConnected = createAction("SET_CONNECTED");
const notify = createAction("NOTIFY");
const patch = createAction("PATCH");

const status = createReducer({
    [setConnected]: (state, payload) => ({ ...state, connected: payload }),
    [notify]: (state, payload) => ({ ...state, message: payload }),
}, {
    url: getUrl("url") || (document.location.hostname == 'localhost' ? 'http://localhost:8181' : `${window.location.protocol}//${document.location.hostname}`),
    connected: false,
    message: ""
});

const settings = createReducer({
    [setUrl]: (state, payload) => ({ ...state, url: payload }),
    [setFilter]: (state, payload) => ({ ...state, filter: escapeStringRegexp(payload) }),
    [setEditorText]: (state, payload) => {
        localStorage.setItem("EDITOR_TEXT", payload)
        return { ...state, editorText: payload };
    }
}, {
    templates: {
        javascript: require("raw!../assets/template.txt")
    },
    filter: "",
    editorText: localStorage.getItem("EDITOR_TEXT")
});

const internal = createReducer({
    [patch]: (state, payload) => {
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
}, {
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
});

const log = createReducer({
    [addLog]: (state, payload) => [ ...state, payload ],
    [addLogs]: (state, payload) => [ ...state, ...payload ]
}, []);

// Export actions & reducers
export const actions = { setUrl, setFilter, setEditorText, addLog, addLogs, setConnected, notify, patch }
export const reducers = { settings, log,  status, internal };
