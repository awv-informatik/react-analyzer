import React from 'react';
import { connect } from 'react-redux';
import { AutoSizer, VirtualScroll } from 'react-virtualized';
import LogItem from '../components/LogItem';
import { actions } from '../store/reducers';

@connect(state => ({ log: state.log, filter: state.settings.filter }))
export default class Logs extends React.Component {
    static propTypes = { wrap: React.PropTypes.bool }
    static defaultProps = { wrap: false }

    setFilter = (filter) =>
        this.props.dispatch(actions.setFilter(filter));

    render() {

        // Apply filter
        let filter = new RegExp(this.props.filter, "i");
        let filteredLog = this.props.log.filter(item => (
              filter.test(item.message) ||
              filter.test(item.user.key) ||
              filter.test(item.classcad.key)
        ));

        return (
            <div style={styles.wrapper}>
                <AutoSizer>
                    {({ width, height }) => (
                        <VirtualScroll style={styles.scroller} rowStyle={{ position: 'absolute' }} width={width} height={height}
                            rowCount={filteredLog.length} rowHeight={ ({ index }) => index === 0 ? 93.5 : 19.5 }
                            rowRenderer={({ index, isScrolling }) =>
                                <LogItem key={index} index={index} wrap
                                    {...filteredLog[index]} onItemClicked={this.setFilter} style={{ marginRight: 100 }}/>}
                            noRowsRenderer={() =>
                                <div className="log" style={{ paddingTop: 74 }}>No logs received ...</div>}
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }
}

const styles = {
    wrapper: { position: 'absolute', width: '100%', height: '100%' },
    scroller: { position: 'relative', overflowY: 'auto', overflowX: 'hidden', outline: 'none' }
}
