import React from 'react';
import { Canvas as CanvasImpl } from 'awv3';

// Keep global reference
let canvas = new CanvasImpl();

export default class Canvas extends React.Component {
    constructor() {
        super();
        this.canvasImpl = canvas;
    }

    get interface () {
        return this.canvasImpl;
    }

    componentDidMount() {

        this.canvasImpl.dom.style.position = 'absolute';
        this.refs.canvas.insertBefore(this.canvasImpl.dom, this.refs.canvas.firstChild);
        setTimeout(() => this.canvasImpl.renderer.resize(), 200);
    }

    render() {
        return (
            <div ref="canvas" style={{ height: '100%', width: '100%', overflow: 'hidden', ...this.props.style }}>
                {React.Children.map(this.props.children, child =>
                    React.cloneElement(child, { ...child.props, canvas: this }))}
            </div>
        );
    }
}
