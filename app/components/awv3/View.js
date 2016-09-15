import React from 'react';
import THREE from 'three';
import { View as ViewImpl } from 'awv3';

export default class View extends React.Component {

    static propTypes = { up: React.PropTypes.array }
    static defaultProps = { up: [0, 0, 1] }

    componentDidMount() {
        this.viewImpl = new ViewImpl(this.props.canvas.canvasImpl, {
            dom: this.refs.view, up: new THREE.Vector3().fromArray(this.props.up)
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
            <div ref="view" style={{ position: 'absolute', height: '100%', width: '100%', overflow: 'hidden', ...this.props.style }}>
                {this.props.children}
            </div>
        );
    }
}
