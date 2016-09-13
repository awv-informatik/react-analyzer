import React from 'react';
import Stat from 'rebass/dist/Stat';

export default class Status extends React.Component {

    static propTypes = {
        source: React.PropTypes.array,
    }

    static defaultProps = {
        source: []
    }

    render() {

        return (
            <Stat
                label={this.props.label}
                unit={this.props.name}
                value={this.props.source.length}
                style={{ color: '#8c8c8c', paddingBottom: 15 }}
            />
        );
    }
}
