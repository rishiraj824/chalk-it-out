import React, { useRef, useState, Component } from 'react';
import Layout from './Layout';
import { Canvas, useFrame } from 'react-three-fiber'
import Sketch from './lib/index';
import './Blackboard.css';
import { CirclePicker } from 'react-color';
import ClickedOutside from '@bit/rishiraj824.react-components.clicked-outside';
import BrushSizeComponent from './components/brush-size';

/* 
function Box(props) {b
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

    constructor(props){
        super(props);
        this.state = {
            sheets: [],
            isPreview: false,
            isPaletteOpen: false,
            selectedOption: '',
            color: '#E3EB64',
            background: '#ffffff',
            brushSize: 5,
            paletteOptions: [{  
                name:'bSize',
                component: () => <BrushSizeComponent onSelection={this.onBrushSizeSelection}/>,
                icon: './brush.svg' 
            },{
                name: 'bColor', 
                component: () => <CirclePicker onChangeComplete={this.handleChangeBrushColorComplete} />,
                icon: './color-picker.svg'
            },{
                name: 'background', 
                component: () => <CirclePicker onChangeComplete={this.handleChangeBackgroundComplete} />,
                icon: './background.svg'
            },{
                name: 'eraser',
                icon: './eraser.svg'
            }]
        }
    }

    onBrushSizeSelection = (size) => {
        this.setState({
            brushSize: Number(size.slice(0, size.length - 1)) * this.state.brushSize,
            isPaletteOpen: false,
            selectedOption: ''
        })
    }

    togglePalette = () => this.setState({ isPaletteOpen: !this.state.isPaletteOpen });

    closePalette = () => this.setState({ isPaletteOpen: false });

    getBlackboard = () => {
            /*const COLOURS = [ '#E3EB64', '#A7EBCA', '#FFFFFF', '#D8EBA7', '#868E80' ];*/

            let self = this;
            let radius = self.state.brushSize;
            let background = self.state.background;
    
            Sketch.create({
    
                container: document.getElementById( 'blackboard' ),
                autoclear: false,
                background: self.state.background,
                /*type: 'WEB_GL',*/
                retina: 'auto',
    
                setup: function() {
                    console.log( 'setup' );
                },
                update: function() {
                    radius = self.state.brushSize;
                    background = self.state.background;

                },
                // Event handlers
    
                keydown: function() {
                    if ( this.keys.C ) this.clear();
                },
    
                // Mouse & touch events are merged, so handling touch events by default
                // and powering sketches using the touches array is recommended for easy
                // scalability. If you only need to handle the mouse / desktop browsers,
                // use the 0th touch element and you get wider device support for free.
                touchmove: function () {
    
                    for ( var i = this.touches.length - 1, touch; i >= 0; i-- ) {
    
                        touch = this.touches[i];
    
                        this.lineCap = 'round';
                        this.lineJoin = 'round';
                        this.fillStyle = this.strokeStyle = self.state.color;
                        this.lineWidth = radius;
    
                        this.beginPath();
                        this.moveTo( touch.ox, touch.oy );
                        this.lineTo( touch.x, touch.y );
                        this.stroke();
                    }
                }
            });
    }
    eraser = () => {
        this.onBrushSizeSelection('2x');
        this.handleChangeBrushColorComplete({ hex: this.state.background })
    }
    selectPaletteOption = (option) => this.setState({ selectedOption: option });
    
    // credits to https://stackoverflow.com/a/50126796/3971360
    fillCanvasBackgroundWithColor = (canvas, color) => {
        const context = canvas.getContext('2d');
      
        context.save();
      
        context.globalCompositeOperation = 'destination-over';
      
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
      
         context.restore();
    }
    handleChangeBackgroundComplete = (color, event) => {
        this.setState({ background: color.hex, selectedOption: '', isPaletteOpen: false });
        
        // to do: use the sketch library to do this
        this.fillCanvasBackgroundWithColor(document.getElementsByTagName('canvas')[0],color.hex);
    };

    handleChangeBrushColorComplete = (color, event) => {
        this.setState({ color: color.hex, selectedOption: '', isPaletteOpen: false });
    };

    openPaletteOptions = () => {
        const { paletteOptions: options, selectedOption } = this.state;
        return options.map(option=>{
            return <React.Fragment key={option.name}>
                   {option.component && (selectedOption === option.name) ? <div className="option-container"><option.component/></div> : ''}
                   <img onClick={option.name==='eraser'? this.eraser.bind(this) : this.selectPaletteOption.bind(this, option.name)} className="palette-option-image" src={option.icon} alt={option.name} />
                </React.Fragment>
        })
    }
    componentDidMount() {
        this.getBlackboard();
        this.fillCanvasBackgroundWithColor(document.getElementsByTagName('canvas')[0], '#ffffff');
    }

    createSheet =()=> {
        const canva = document.getElementsByTagName('canvas')[0];
        const ctx = canva.getContext('2d');

        const dataURL = canva.toDataURL('image/jpeg', 0.3);
        const sheets = this.state.sheets;

        sheets.push(dataURL);
        // to do: figure out a way to clear using the library
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "white";
        canva.style.backgroundColor = '#fff';
        this.setState({
            sheets
        })
    }

    showPreview = (selectedSheet) => {
        this.setState({
            isPreview: true,
            selectedSheet
        })
    }

    closePreview = () => {
        this.setState({
            isPreview: false
        })
    }

    render(){

        const sheets = this.state.sheets;

        const SheetNav = () => <React.Fragment>
                {sheets.map((sheet,i)=>
                    <div key={`sheet${i}`} className="sheet-nav" onClick={this.showPreview.bind(this, sheet)}><img className="sheet-nav-image" src={sheet} /></div>)
                }
                <div className="sheet-nav create-sheet" onClick={this.createSheet}>+</div>
            </React.Fragment>

        const Preview = () => <React.Fragment>
            <div className="overlay" onClick={this.closePreview}></div>
            <div className="preview">
                <img className='preview-sheet-image' src={this.state.selectedSheet} />
            </div>
        </React.Fragment>

        const PaletteOptions = () => <React.Fragment>{this.openPaletteOptions()}</React.Fragment>

        const MixedPreviewComponent = ClickedOutside({
            component: Preview,
            props: {
                className: 'modal-preview',
                close: this.closePreview
            }
        })
        
        const MixedComponent = ClickedOutside({
			component: PaletteOptions,
			props: {
                className: 'palette-options',
                close: this.closePalette,
            },
        })
        
        const PaletteComponent = () =>  <div className="palette" onClick={this.togglePalette}>  
            <img src="./paint-palette.svg" onClick={this.openPaletteOptions} className="palette-icon" />
        </div>

        return (<Layout>
           {/*} <Canvas id="blackboard">
            </Canvas>*/}
        <div id="blackboard" className="blackboard"></div>
        <div className="right-nav">
            <SheetNav />
            <PaletteComponent />
        </div>

        {this.state.isPaletteOpen && <MixedComponent />}
        {this.state.isPreview && <MixedPreviewComponent />}
        </Layout>)
    }
}
