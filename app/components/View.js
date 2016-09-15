import React from 'react';
import Canvas from '../components/awv3/Canvas';
import View from '../components/awv3/View';
import JSONTree from 'react-json-tree'

export default class ViewImpl extends React.Component {
    constructor() {
        super();
        this.state = { resultsUp: false };
    }

    componentDidMount() {
        this.viewImpl = this.refs.view.viewImpl;
    }

    toggle = () =>
        this.setState({ resultsUp: !this.state.resultsUp });

    render() {
        return (
            <div style={styles.view}>

                <Canvas style={styles.canvas}>
                    <View ref="view" up={ [0, 1, 0] } />
                </Canvas>

                <div className="results" style={{
                    ...styles.results, transform: `translate3d(0,${ this.state.resultsUp ? '0' : 'calc(100% - 40px)' },0)` }}>

                    <div ref="results-handle" style={{
                        ...styles.handle, backgroundColor: this.props.results.length > 0 ? '#11cc77' : '#c6c6c6' }} onClick={this.toggle}>

                        <i className={`large ${this.state.resultsUp ? 'headsup' : ''} chevron up icon`} style={{ transition: 'transform .2s'}}/>
                        <span style={{ marginLeft: 10 }}>Results</span>

                    </div>

                    <JSONTree data={this.props.results} />

                </div>

            </div>
        );
    }
}

const styles = {
    view: { position: 'relative', width: '100%', height: 'calc(100vh - 60px)' },
    canvas: { backgroundColor: '#efefef', position: 'relative', width: '100%', height: '100%', overflow: 'hidden' },
    results: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#dfdfdf', transition: 'transform .5s', willChange: 'transform' },
    handle: { display: 'flex', alignItems: 'center', paddingLeft: 50, height: 40, fontSize: 14, fontWeight: 'bold', color: 'white', transition: 'background-color 1s', cursor: 'pointer', borderTop: '1px #b5b5b5 solid' }
}
