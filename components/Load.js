import React from 'react';
import Donut from 'rebass/dist/Donut';
import { connect } from 'react-redux';

const states = ['green', 'yellow', 'orange', '#E53935', '#D81B60'];

@connect(state => ({
    queue: state.internal.queue,
    users: state.internal.users,
    sessions: state.internal.sessions,
    analyzers: state.internal.analyzers
}))
export default class Load extends React.Component {

    static propTypes = {
        queue: React.PropTypes.array,
        users: React.PropTypes.array,
        analyzers: React.PropTypes.array,
        sessions: React.PropTypes.array,
        size: React.PropTypes.number,
        strokeWidth: React.PropTypes.number,
        calc: React.PropTypes.func
    }

    static defaultProps = {
        queue: [],
        users: [],
        analyzers: [],
        sessions: [],
        size: 200,
        strokeWidth: 32
    }

    constructor() {
        super();
        this.value = 0;
    }

    render() {

        let sessions = this.props.sessions.length;
        let busy = this.props.sessions.reduce((prev, cur) => prev + cur.tasks.length, 0);
        let users = this.props.users.length;
        let queue = this.props.queue.length;
        let value = Math.min(1, this.props.calc ? this.props.calc(sessions, users, queue) : queue / users) || 0;
        this.value = value;
        let color = states[Math.floor(this.value * (states.length - 1))];

        return (
            <div style={{ position: 'relative', ...this.props.style }}>
                {this.props.children}
                <Donut
                    color={color}
                    size={this.props.size}
                    strokeWidth={this.props.strokeWidth}
                    value={+this.value}
                />
            </div>
        );
    }
}
