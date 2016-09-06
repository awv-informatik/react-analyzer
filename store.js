import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import jsonpatch from 'fast-json-patch';
import SocketIO from 'awv3/communication/socketio';
import alertify from 'alertify.js';

const settings = (state = {}, action) => {
    switch (action.type) {
        case 'SET_URL':
            return { ...state, url: action.url };
        default:
            return state;
    }
};

const log = (state = [], action) => {
    switch (action.type) {
        case 'ADD_LOG':
            return [ ...state, action.object ];
        default:
            return state;
    }
};

const status = (state = {}, action) => {
    switch (action.type) {
        case 'SET_CONNECTED':
            return { ...state, connected: action.connected };
        case 'NOTIFY':
            return { ...state, message: action.message };
        default:
            return state;
    }
};

const localState = {
    status: {
        connected: false,
        message: ".."
    },
    settings: {
        url: document.location.hostname == 'localhost' ? 'http://localhost:8181' : `${window.location.protocol}//${document.location.hostname}`,
        template: require("raw!./assets/template.txt"),
        layout: [
            {
                type: 'row',
                content: [
                    { type:'react-component', title: 'View', component: 'SingleView' },
                    {
                        type: 'column',
                        content: [
                            { type:'react-component', title: 'Javascript Editor', component: 'Editor' },
                            { type:'react-component', title: 'Interpreter Editor', component: 'Editor' },
                            { type:'react-component', title: 'Log', component: 'Log' }
                        ]
                    }
                ]
            }
        ]
    }
};

// Get state local storage, if any
try {
    let state = localStorage.getItem('SETTINGS');
    if (state !== null) {
        localState.settings = JSON.parse(state);
    }
} catch(e) { /* ... */ }

// Expose store and actions
export const store = createStore(combineReducers({ settings, log, status }), localState);
export const setUrl = url => store.dispatch({ type: 'SET_URL', url });
export const addLog = object => store.dispatch({ type: 'ADD_LOG', object });
export const notify = message => store.dispatch({ type: 'NOTIFY', message });
export const setConnected = connected => store.dispatch({ type: 'SET_CONNECTED', connected });

class Analyzer extends SocketIO {
    constructor() {
        super({ debug: true, credentials: [] });
        this.on('connected', socket => {
            setConnected(true);
            this.socket.on('debug', data => {
                SocketIO._ack(this.socket);

                switch(data.type) {
                    case 'message':
                        addLog(data);
                }
            });
        });
        this.on('disconnected', socket => {
            setConnected(false);
        });
    }
}

let url = store.getState().settings.url;
let analyzer = new Analyzer();
analyzer.connect(url)
    .then( _ => notify(`Connected to ${url}`))
    .catch( reason => {
        notify(`Could not connect to ${url}, reason: ${reason}`);
        alertify.defaultValue(url).prompt("Enter server endpoint", val => {
            url = setUrl(val).url;
            analyzer.connect(url)
                .then( _ => notify(`Connected to ${url}`))
                .catch( reason => notify(`Could not connect to ${url}, reason: ${reason}`));
        });
    });
