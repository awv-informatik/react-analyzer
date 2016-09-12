import React from 'react';
import { connect } from 'react-redux'
import { v4 } from 'node-uuid';

export default class Cluster extends React.Component {

    static propTypes = {
        source: React.PropTypes.array
    }

    static defaultProps = {
        source: []
    }

    render() {

        let root = Math.round(Math.sqrt(this.props.source.length));
        let result = [];
        let index = 0;
        while (index < this.props.source.length) {
            let row = [];
            result.push(row);
            for (let r = 0; r < root; r++) {
                let item = this.props.source[index++];
                if (item) {
                    row.push(item)
                } else {
                    break;
                }
            }
        }

        return (
            <table style={{ tableLayout: 'fixed', width: '100%', height: '100%', color: 'white' }}>
            <tbody>
                {result.map(row => (
                    <tr key={v4()}>
                        {row.map(col => (
                            <td key={v4()} className={'bg-color-' + col.color + '-600'}>

                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            </table>
        )
    }
}

export const SessionCluster = connect(state => ({ source: state.internal.sessions }))(Cluster);
export const UserCluster = connect(state => ({ source: state.internal.users }))(Cluster);
export const TaskCluster = connect(state => ({ source: state.internal.tasks }))(Cluster);
export const QueueCluster = connect(state => ({ source: state.internal.queue }))(Cluster);
