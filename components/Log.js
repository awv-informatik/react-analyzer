import React from 'react';
import { v4 } from 'node-uuid';
import { connect } from 'react-redux';
import { AutoSizer, VirtualScroll } from 'react-virtualized';

export const FlatItemLine = ({ index, classes, sign, classcad, user, message, diff, onItemClicked, wrap }) => (
    <div style={{ display: 'flex', ...( index === 0 ? { alignItems: 'flex-end', height: '100%' } : {} ) }}
        className={sign === '>>>' ? 'inverted' : ''}>

        <span onClick={e => onItemClicked(e.target.textContent)}
            className={`classcad color-${classcad.color}-600`}
            style={{ minWidth: 95, marginRight: 5 }}>
            CCD{classcad.key}
        </span>
        <span onClick={e => onItemClicked(e.target.textContent)}
            className={`user color-${user.color}-600`}
            style={{ minWidth: 95, marginRight: 5 }}>
            USR{user.key.substring(0, 8)}
        </span>
        <span onClick={e => onItemClicked(e.target.textContent)}
            className="sign"
            style={{ minWidth: 30, marginRight: 5 }}>
            {sign}
        </span>
        <span className="message" style={wrap ? { overflow: 'hidden' } : {}}>
            <span onClick={e => onItemClicked(e.target.textContent)}
                className={`${classes}`}
                style={wrap ? { whiteSpace: 'nowrap' } : {} }>
                {message}
            </span>
        </span>
        <span style={{
            flex: 1,
            minWidth: 60,
            marginLeft: 5,
            textAlign: (diff ? 'right' : 'initial')}}>
            {diff ? `+${diff}ms` : ''}
        </span>
    </div>
);

export default class Log extends React.Component {
    static propTypes = {
        lines: React.PropTypes.array,
        wrap: React.PropTypes.bool,
        filter: React.PropTypes.string
    }

    static defaultProps = {
        lines: [],
        wrap: false,
        filter: ""
    }

    setFilter = (filter) =>
        this.props.dispatch({ type: 'SET_FILTER', filter });

    render() {

        this.items = this.props.lines;

        // Filter props
        if (this.props.filter.length > 0) {
            let filter = new RegExp(this.props.filter, "i");
            this.items = this.props.lines.filter(item => (
               filter.test(item.message) ||
               filter.test("USR" + item.user.key) ||
               filter.test("CCD" + item.classcad.key)
           ));
        }

        return (
            <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                <AutoSizer>
                    {({ width, height }) => (
                        <VirtualScroll
                            style={{ position: 'relative', overflowY: 'auto', overflowX: 'hidden', outline: 'none' }}
                            rowStyle={{ position: 'absolute' }}
                            className="log"
                            width={width}
                            height={height}
                            rowCount={this.items.length}
                            rowHeight={ ({ index }) => index === 0 ? 93.5 : 19.5 }
                            rowRenderer={({ index, isScrolling }) =>
                                <FlatItemLine key={index} index={index} wrap={true} {...this.items[index]} onItemClicked={this.setFilter} /> }
                            noRowsRenderer={() => <div className="log" style={{ paddingTop: 74 }}>No logs received ...</div>}
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }
}
