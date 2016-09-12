import React from 'react';
import { v4 } from 'node-uuid';
import { connect } from 'react-redux';

const Input = ({ style, filter, onValueChanged }) => (
    <input type="text" value={filter} onChange={e => onValueChanged(e.target.value)} style={{ ...style }}/>
);

const HeaderTable = ({ style, className }) => (
    <table className={className} style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse', ...style }}>
        <thead>
            <tr>
                <th style={{ width: 65, textAlign: 'left' }}>ClassCAD</th>
                <th style={{ width: 65, textAlign: 'left' }}>User</th>
                <th style={{ width: 30, textAlign: 'left' }}>Key</th>
                <th style={{ textAlign: 'left' }}>Message</th>
                <th style={{ width: 60, textAlign: 'right', paddingRight: 14 }}>Delta</th>
            </tr>
        </thead>
    </table>
);

const ItemLine = ({ classes, sign, classcad, user, message, diff, onItemClicked, wrap }) => (
    <tr style={{ verticalAlign: 'baseline' }}
        className={sign === '>>>' ? 'inverted' : ''}>

        <td onClick={e => onItemClicked(e.target.innerHTML)}
            className={`classcad color-${classcad.color}-600`}
            style={{ width: 65 }}>
            {classcad.key}
        </td>
        <td onClick={e => onItemClicked(e.target.innerHTML)}
            className={`user color-${user.color}-600`}
            style={{ width: 65 }}>
            {user.key.substring(0, 8)}
        </td>
        <td onClick={e => onItemClicked(e.target.innerHTML)}
            className="sign"
            style={{ width: 30 }}>
            {sign}
        </td>
        <td className="message" style={wrap ? { overflow: 'hidden', textOverflow: 'ellipsis' } : {}}>
            <span onClick={e => onItemClicked(e.target.innerHTML)}
                className={`${classes} color-${user.color}-600`}
                style={wrap ? { whiteSpace: 'nowrap' } : {} }>
                {message}
            </span>
        </td>
        <td style={{
            width: 60,
            textAlign: (diff ? 'right' : 'initial')}}>
            {diff ? `+${diff}ms` : ''}
        </td>
    </tr>
);

const ItemTable = ({ wrap, lines, onItemClicked }) => (
    <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
            {lines.map(item => <ItemLine wrap={wrap} {...item} onItemClicked={onItemClicked} key={v4()} />)}
        </tbody>
    </table>
);

export default class Log extends React.Component {
    static propTypes = {
        lines: React.PropTypes.array,
        wrap: React.PropTypes.bool
    }

    static defaultProps = {
        lines: [],
        wrap: false
    }

    constructor() {
        super();

        this.state = {
            filter: ""
        };
    }

    setFilter = (value) =>
        this.setState({ filter: value });

    /*componentDidUpdate(prevProps) {
        let height = this.refs.scoller.scrollHeight;
        let factor = this.refs.scoller.scrollTop / height;
        console.log(this.refs.scoller.scrollTop, height, factor)
        if (factor > 0.95 && factor < 1.5)
            this.refs.scoller.scrollTop = this.refs.scoller.scrollHeight;
    }*/

    componentDidMount() {
        console.log("mount")
    }

    componentWillUnmount() {
        console.log("unmount")
    }

    render() {

        let lines = this.props.lines;

        // Filter props
        if (this.state.filter.length > 0) {
            let filter = new RegExp(this.state.filter, "i");
            lines = this.props.lines.filter(item => (
               filter.test(item.message) ||
               filter.test(item.user.key) ||
               filter.test(item.classcad.key)
           ));
        }

        return (
            <div className="log" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <ItemTable wrap={this.props.wrap} lines={lines} onItemClicked={this.setFilter} />
            </div>
        );
    }
}
/*<HeaderTable className="log" style={{marginRight: 14}} />*/
//<Input filter={this.state.filter} onValueChanged={this.setFilter} style={{margin: 10}} />
