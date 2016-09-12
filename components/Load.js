import React from 'react';
import Donut from 'rebass/dist/Donut';
import { connect } from 'react-redux';

const states = ['green', 'yellow', 'orange', '#E53935', '#D81B60'];

export default class Load extends React.Component {

    static propTypes = {
        queue: React.PropTypes.array,
        users: React.PropTypes.array,
        analyzers: React.PropTypes.array,
        sessions: React.PropTypes.array
    }

    static defaultProps = {
        queue: [],
        users: [],
        analyzers: [],
        sessions: []
    }

    constructor() {
        super();
        this.value = 0;
    }

    shouldComponentUpdate(nextProps) {

        let sessions = nextProps.sessions.length;
        let busy = nextProps.sessions.reduce((prev, cur) => prev + cur.tasks.length, 0);
        let users = nextProps.users.length;
        let queue = nextProps.queue.length;
        let value = Math.min(1, queue / users) || 0;

        if (this.value != value) {
            this.value = value;
            return true
        } else {
            return false;
        }
    }

    render() {


        let color = states[Math.floor(this.value * (states.length - 1))];

        return (
            <Donut
                color={color}
                size={256}
                strokeWidth={32}
                value={+this.value}
            />
        );
    }
}
