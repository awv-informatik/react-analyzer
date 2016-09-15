import React from 'react';
import Stat from 'rebass/dist/Stat';

export default class Status extends React.Component {

    static propTypes = {
        value: React.PropTypes.number,
    }

    static defaultProps = {
        value: 0
    }

    render() {

        return (
            <Stat
                label={this.props.label}
                unit={" " + this.props.name}
                value={this.props.value}
                style={{ color: '#8c8c8c', paddingBottom: 15 }}
            />
        );
    }
}
