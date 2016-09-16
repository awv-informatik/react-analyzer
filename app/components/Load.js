import React from 'react';
import Donut from 'rebass/dist/Donut';
import { connect } from 'react-redux';

const states = ['green', 'orange', 'red', '#E53935', '#D81B60'];

@connect(state => ({
    queue: state.internal.stats.queue,
    sessions: state.internal.stats.sessions,
    peak: state.internal.stats.peak
}))
export default class Load extends React.Component {
    static propTypes = { size: React.PropTypes.number, strokeWidth: React.PropTypes.number, calc: React.PropTypes.func }
    static defaultProps = { size: 200, strokeWidth: 32 }

    render() {
        let { sessions, queue, peak } = this.props;
        let value = Math.min(1, this.props.calc ? this.props.calc(this.props) : queue / peak) || 0;
        let color = states[Math.floor(value * (states.length - 1))];

        return (
            <div style={{ position: 'relative', ...this.props.style }}>
                {this.props.children}
                <Donut color={color} size={this.props.size} strokeWidth={this.props.strokeWidth} value={+value} />
            </div>
        );
    }
}
