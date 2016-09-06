import React from 'react';
import { connect } from 'react-redux'
import { v4 } from 'node-uuid';

export default class Log extends React.Component {
    render() {
        return(
            <div className="log">
                <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        <th style={{ width: '65px', textAlign: 'left' }}>ClassCAD</th>
                        <th style={{ width: '65px', textAlign: 'left' }}>User</th>
                        <th style={{ width: '30px', textAlign: 'left' }}>Key</th>
                        <th style={{ textAlign: 'left' }}>Message</th>
                        <th style={{ width: '60px', textAlign: 'right', backgroundColor: 'rgba(255,255,255,0.05)' }}>Delta</th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.props.log.map(item => (
                            <tr key={v4()}
                                style={{ verticalAlign: 'baseline' }}
                                className={item.sign === '>>>' && 'inverted'}>

                                <td>{item.classcad.key}</td>
                                <td>{item.user.key.substring(0, 8)}</td>
                                <td>{item.sign}</td>
                                <td>{item.message}</td>
                                {item.diff ?
                                    <td style={{ textAlign: 'right', backgroundColor: 'rgba(255,255,255,0.05)' }}>+{item.diff}ms</td> :
                                    <td style={{backgroundColor: 'rgba(255,255,255,0.05)'}}></td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    static connect(state) {
        return connect(state => ({ log: state.log }))(Log);
    }
}
