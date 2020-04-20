import React, { useRef, useState, Component } from 'react';
import Layout from './Layout';
import { Canvas, useFrame } from 'react-three-fiber'
import Sketch from './lib/index';

/* 
function Box(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    
    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))
    
    return (
        <mesh
          {...props}
          ref={mesh}
          scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
          onClick={e => setActive(!active)}
          onPointerOver={e => setHover(true)}
          onPointerOut={e => setHover(false)}>
          <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
          <meshStandardMaterial attach="material" color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
  }
 */
export default class Blackboard extends Component {

    getBlackboard = () => {
            const COLOURS = [ '#E3EB64', '#A7EBCA', '#FFFFFF', '#D8EBA7', '#868E80' ];
            let radius = 0;
    
            Sketch.create({
    
                container: document.getElementById( 'blackboard' ),
                autoclear: false,
                retina: 'auto',
    
                setup: function() {
                    console.log( 'setup' );
                },
    
                update: function() {
                    radius = 2 + Math.abs( Math.sin( this.millis * 0.003 ) * 50 );
                },
    
                // Event handlers
    
                keydown: function() {
                    if ( this.keys.C ) this.clear();
                },
    
                // Mouse & touch events are merged, so handling touch events by default
                // and powering sketches using the touches array is recommended for easy
                // scalability. If you only need to handle the mouse / desktop browsers,
                // use the 0th touch element and you get wider device support for free.
                touchmove: function() {
    
                    for ( var i = this.touches.length - 1, touch; i >= 0; i-- ) {
    
                        touch = this.touches[i];
    
                        this.lineCap = 'round';
                        this.lineJoin = 'round';
                        this.fillStyle = this.strokeStyle = COLOURS[ i % COLOURS.length ];
                        this.lineWidth = radius;
    
                        this.beginPath();
                        this.moveTo( touch.ox, touch.oy );
                        this.lineTo( touch.x, touch.y );
                        this.stroke();
                    }
                }
            });
    }
    componentDidMount() {
        this.getBlackboard()
    }
    render(){
        return (<Layout>
            {/*<Canvas>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Box position={[-1.2, 0, 0]} />
              <Box position={[1.2, 0, 0]} />
            </Canvas>*/}
            <div id="blackboard"></div>
            </Layout>)
    }
}
