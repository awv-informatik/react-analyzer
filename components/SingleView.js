import React from 'react';
import { Presentation } from 'awv3';
import Canvas from '../components/Canvas';
import View from '../components/View';

export default class SingleView extends React.Component {
    async componentDidMount() {

        let view = await this.refs.view.interface;
        let { models } = await view.canvas.parser.stream('/assets/haken-sat.txt');
        let presentation = new Presentation(models);
        view.scene.add(presentation);
        view.controls.focus().zoom();

        if (this.props.glContainer) {
            this.props.glContainer.on('resize', () => view.renderer.resize());
            this.props.glContainer.on('show', () => setTimeout(() => view.renderer.resize(), 100));
        }
    }

    render() {
        return (
            <Canvas style={{ position: 'relative', height: '100%', width: '100%', ...this.props.style }}>
                <View ref="view" up={ [...this.props.up] } />
            </Canvas>
        )
    }
}

SingleView.propTypes = {
    up: React.PropTypes.array
}

SingleView.defaultProps = {
    up: [0, 1, 0]
}
