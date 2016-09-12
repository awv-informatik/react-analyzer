import React from 'react';
import { Canvas as CanvasImpl } from 'awv3';

export default class Canvas extends React.Component {
    constructor() {
        super();
        this.promise = new Promise(res => this.resolve = res);
    }

    get interface () {
        return this.promise;
    }

    componentDidMount() {
        this.canvasImpl = new CanvasImpl({ dom: this.refs.canvas });
        this.resolve(this.canvasImpl);
    }

    componentWillUnmount() {
        if (this.canvasImpl) {
            this.canvasImpl.destroy();
            delete this.canvasImpl;
        }
    }

    // todo: context for canvas
    // componentdimount render children into target
    // remove promises
    render() {
        return (
            <div ref="canvas" style={{ height: '100%', width: '100%', overflow: 'hidden', ...this.props.style }}>
                {React.Children.map(this.props.children, child =>
                    React.cloneElement(child, { ...child.props, canvas: this }))}
            </div>
        );
    }
}
