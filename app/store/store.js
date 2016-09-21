import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import throttle from 'lodash/throttle';
import SocketIO from 'awv3/communication/socketio';
import { actions, reducers } from './reducers';

// Expose store and actions
export const store = createStore(combineReducers(reducers), undefined, window.devToolsExtension && window.devToolsExtension());

class Analyzer extends SocketIO {
    constructor() {
        super({ debug: true, credentials: [] });

        this.messages = [];
        this.patches = [];

        this.on('connected', (socket, data) => {
            store.dispatch(actions.patch(data.tree));
            store.dispatch(actions.setConnected(true));
            store.dispatch(actions.notify(store.getState().settings.url));

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
            store.dispatch(actions.setConnected(false));
            this.update();
        });

        this.on('error', reason => {
            store.dispatch(actions.setConnected(false));
            store.dispatch(actions.notify(reason.message))
            this.update();
        });
    }

    update = throttle(() => {
        this.messages.length > 0 && store.dispatch(actions.addLogs(this.messages));
        this.patches.length > 0 && this.patches.forEach(patchSet => store.dispatch(actions.patch(patchSet)));
        this.patches = [];
        this.messages = [];
    }, store.getState().internal.stats.queue > 10 ? 500 : 50);
}

let url = store.getState().status.url;
export const analyzer = new Analyzer();
analyzer.connect(url).catch( reason => store.dispatch(actions.notify(reason.message)));
