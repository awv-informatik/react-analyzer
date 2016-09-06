import React from 'react';
import THREE from 'three';
import { View as ViewImpl } from 'awv3';

export default class View extends React.Component {
    constructor() {
        super();
        this.promise = new Promise(res => this.resolve = res);
    }

    get interface () {
        return this.promise;
    }

    componentDidMount() {
        this.props.canvas.interface.then(canvas => {
            this.viewImpl = new ViewImpl(canvas, { dom: this.refs.view, up: new THREE.Vector3().fromArray(this.props.up) });
            this.resolve(this.viewImpl);
        });
    }

    componentWillUnmount() {
        if (this.viewImpl) {
            this.viewImpl.destroy();
            delete this.viewImpl;
        }
    }

    render() {
        return (
            <div ref="view" style={{ height: '100%', width: '100%', overflow: 'hidden', ...this.props.style }}>
                {this.props.children}
            </div>
        );
    }
}

View.propTypes = {
    up: React.PropTypes.array
}

View.defaultProps = {
    up: [0, 0, 1]
}
