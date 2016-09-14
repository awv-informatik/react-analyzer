import React from 'react';
import { v4 } from 'node-uuid';
import { connect } from 'react-redux';
import { AutoSizer, VirtualScroll } from 'react-virtualized';

@connect(state => ({ log: state.log, filter: state.settings.filter }))
export default class Log extends React.Component {
    static propTypes = { wrap: React.PropTypes.bool }
    static defaultProps = { wrap: false }

    setFilter = (filter) =>
        this.props.dispatch({ type: 'SET_FILTER', filter });

    render() {

        // Apply filter
        if (this.props.filter.length > 0) {
            let filter = new RegExp(this.props.filter, "i");
            this.props.log = this.props.log.filter(item => (
               filter.test(item.message) ||
               filter.test("USR" + item.user.key) ||
               filter.test("CCD" + item.classcad.key)
           ));
        }

        return (
            <div style={style.wrapper}>
                <AutoSizer>
                    {({ width, height }) => (
                        <VirtualScroll
                            style={style.scroller}
                            rowStyle={{ position: 'absolute' }}
                            className="log"
                            width={width}
                            height={height}
                            rowCount={this.props.log.length}
                            rowHeight={ ({ index }) => index === 0 ? 93.5 : 19.5 }
                            rowRenderer={({ index, isScrolling }) =>
                                <FlatItemLine
                                    key={index}
                                    index={index}
                                    wrap={true}
                                    {...this.props.log[index]}
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

export const FlatItemLine = ({ index, classes, sign, classcad, user, message, diff, onItemClicked, wrap }) => (
    <div style={{ display: 'flex', ...( index === 0 ? { alignItems: 'flex-end', height: '100%' } : {} ) }}
        className={sign === '>>>' ? 'inverted' : ''}>

        <span onClick={e => onItemClicked(e.target.textContent)}
            className={`classcad color-${classcad.color}-600`}
            style={style.td95}>
            CCD{classcad.key}
        </span>

        <span onClick={e => onItemClicked(e.target.textContent)}
            className={`user color-${user.color}-600`}
            style={style.td95}>
            USR{user.key.substring(0, 8)}
        </span>

        <span onClick={e => onItemClicked(e.target.textContent)}
            className="sign"
            style={style.td30}>
            {sign}
        </span>

        <span className="message" style={wrap ? { overflow: 'hidden' } : {}}>
            <span onClick={e => onItemClicked(e.target.textContent)}
                className={`${classes}`}
                style={wrap ? { whiteSpace: 'nowrap' } : {} }>
                {message}
            </span>
        </span>

        <span style={{ ...style.tdflex, textAlign: (diff ? 'right' : 'initial') }}>
            {diff ? `+${diff}ms` : ''}
        </span>
        
    </div>
);

const style = {
    wrapper: { position: 'absolute', width: '100%', height: '100%' },
    scroller: { position: 'relative', overflowY: 'auto', overflowX: 'hidden', outline: 'none' },
    td95: { minWidth: 95, marginRight: 5 },
    td30: { minWidth: 30, marginRight: 5 },
    tdflex: { flex: 1, minWidth: 60, marginLeft: 5 }
}
