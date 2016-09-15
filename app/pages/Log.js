import React from 'react';
import { v4 } from 'node-uuid';
import { connect } from 'react-redux';
import { AutoSizer, VirtualScroll } from 'react-virtualized';
import escapeStringRegexp from 'escape-string-regexp';

@connect(state => ({ log: state.log, filter: state.settings.filter }))
export default class Log extends React.Component {
    static propTypes = { wrap: React.PropTypes.bool }
    static defaultProps = { wrap: false }

    setFilter = (filter) =>
        this.props.dispatch({ type: 'SET_FILTER', filter });

    render() {

        // Apply filter

        let filter = new RegExp(escapeStringRegexp(this.props.filter), "i");
        let filteredLog = this.props.log.filter(item => (
              filter.test(item.message) ||
              filter.test(item.user.key) ||
              filter.test(item.classcad.key)
        ));

        return (
            <div style={style.wrapper}>
                <AutoSizer>
                    {({ width, height }) => (
                        <VirtualScroll
                            style={style.scroller}
                            rowStyle={{ position: 'absolute' }}
                            width={width}
                            height={height}
                            rowCount={filteredLog.length}
                            rowHeight={ ({ index }) => index === 0 ? 93.5 : 19.5 }
                            rowRenderer={({ index, isScrolling }) =>

                                <Item
                                    key={index}
                                    index={index}
                                    wrap={true}
                                    {...filteredLog[index]}
                                    onItemClicked={this.setFilter} />

                            }
                            noRowsRenderer={() => <div className="log" style={{ paddingTop: 74 }}>No logs received ...</div>}
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }
}

export const Item = ({ index, classes, sign, classcad, user, message, diff, onItemClicked, wrap }) => (
    <div style={{ display: 'flex', ...( index === 0 ? style.firstItem : {} ) }}
        className={`log ${sign === '>>>' ? 'inverted' : ''}`}>

        <span onClick={e => onItemClicked(e.target.textContent)}
            className={`classcad color-${classcad.color}-600`} style={style.td95}>
            {classcad.key}
        </span>

        <span onClick={e => onItemClicked(e.target.textContent)}
            className={`user color-${user.color}-600`} style={style.td95}>
            {user.key.substring(0, 11)}
        </span>

        <span onClick={e => onItemClicked(e.target.textContent)}
            className="sign" style={style.td30}>
            {sign}
        </span>

        <span className="message" style={wrap ? { overflow: 'hidden' } : {}}>
            <span onClick={e => onItemClicked(e.target.textContent)}
                className={`${classes}`} style={wrap ? { whiteSpace: 'nowrap' } : {} }>
                {message}
            </span>
        </span>

        <span style={{ ...style.tdflex, textAlign: (diff ? 'right' : 'initial') }}>
            {diff ? `+${diff}ms` : ''}
        </span>

    </div>
);

const style = {
    firstItem: { alignItems: 'flex-end', height: '100%' },
    wrapper: { position: 'absolute', width: '100%', height: '100%' },
    scroller: { position: 'relative', overflowY: 'auto', overflowX: 'hidden', outline: 'none' },
    td95: { minWidth: 95, marginRight: 5 },
    td30: { minWidth: 30, marginRight: 5 },
    tdflex: { flex: 1, minWidth: 60, marginLeft: 5 }
}
