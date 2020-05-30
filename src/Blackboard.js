import ClickedOutside from '@bit/rishiraj824.react-components.clicked-outside';
import React, { Component } from 'react';
import { CirclePicker } from 'react-color';
import './Blackboard.css';
import BrushSizeComponent from './components/brush-size';
import background from './images/background.svg';
import brush from './images/brush.svg';
import colorPicker from './images/color-picker.svg';
import eraser from './images/eraser.svg';
import colorPalette from './images/paint-palette.svg';
import Layout from './Layout';
import Sketch from './lib/index';

const brushSize = 5;

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
                icon:  brush
            },{
                name: 'bColor', 
                component: () => <CirclePicker onChangeComplete={this.handleChangeBrushColorComplete} />,
                icon: colorPicker
            },{
                name: 'background', 
                component: () => <CirclePicker onChangeComplete={this.handleChangeBackgroundComplete} />,
                icon: background
            },{
                name: 'eraser',
                icon: eraser
            }],
            connected: false,
            setStreaming: false
        }
        this.pc1 = null;
        this.pc2 = null;
        this.offerOptions = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        };
    
        this.peerConnection = null;
        this.canvas = null;
        this.stream = null;
        this.startTime = 0;
        this.wsRef = React.createRef();
        this.videoRef = React.createRef();
        this.mediaRecorderRef = React.createRef();
    }


gotRemoteStream = (e) => {

    if (this.videoRef.current.srcObject !== e.streams[0]) {
      this.videoRef.current.srcObject = e.streams[0];
    }
  }

stopStreaming = () => { 
   if(this.mediaRecorderRef.current.state !== 'inactive') {
      this.mediaRecorderRef.current.stop();
    }
  }

record = () => {
  console.log('Starting record');
  this.startTime = window.performance.now();
  
  console.log(this.wsRef)

  this.wsRef.current.addEventListener('open', ()=> {
    this.setState({
      connected:true,
      setStreaming:false
    })

    const event = {
      event: "join",
      groupName: 'class 11d',
      name: 'rishi',
    };
    this.wsRef.current.send(JSON.stringify(event));
  });

  this.wsRef.current.addEventListener('close', () => {
    this.setState({
      connected:false
    })
    this.stopStreaming();
  });
  this.stream = this.canvas.captureStream(30);

  const outputStream = new MediaStream();
  console.log(this.stream.getTracks())
  this.stream.getTracks().forEach(
    track => {
      outputStream.addTrack(
          track,
          this.stream
      );
    }
  );
  console.log(this.stream)
/* 
  const videoTracks = this.stream.getVideoTracks();
  const audioTracks = this.stream.getAudioTracks();
  if (videoTracks.length > 0) {
    console.log(`Using video device: ${videoTracks[0].label}`);
  }
  if (audioTracks.length > 0) {
    console.log(`Using audio device: ${audioTracks[0].label}`);
  }
 */
  this.mediaRecorderRef.current = new MediaRecorder(outputStream, {
    mimeType: 'video/webm',
    videoBitsPerSecond: 3000000
  });
  console.log(this.mediaRecorderRef)
  this.mediaRecorderRef.current.addEventListener('dataavailable', e => {
    if(this.state.connected) {
      console.log(e.data)
      this.wsRef.current.send(e.data);
    }
  });

  this.mediaRecorderRef.current.addEventListener('stop', () => {
    this.stopStreaming();
    this.wsRef.current.close();
  });

  this.mediaRecorderRef.current.start(1000);

  

  //const servers = null;
  //this.pc1 = new RTCPeerConnection(servers);
  //console.log('Created local peer connection object pc1');
  /* this.pc1.onicecandidate = e => this.onIceCandidate(this.pc1, e);
  this.pc2 = new RTCPeerConnection(servers);
  console.log('Created remote peer connection object pc2');
  this.pc2.onicecandidate = e => this.onIceCandidate(this.pc2, e);
  this.pc1.oniceconnectionstatechange = e => this.onIceStateChange(this.pc1, e);
  this.pc2.oniceconnectionstatechange = e => this.onIceStateChange(this.pc2, e);
  this.pc2.ontrack = this.gotRemoteStream; */

  
    // console.log('Added local stream to pc1');

    // console.log('pc1 createOffer start');
    //this.pc1.createOffer(this.onCreateOfferSuccess, this.onCreateSessionDescriptionError, this.offerOptions);
    }

    onCreateSessionDescriptionError = (error) => {
    console.log(`Failed to create session description: ${error.toString()}`);
    }

    onCreateOfferSuccess = (desc) => {
      console.log(`Offer from pc1\n${desc.sdp}`);
      console.log('pc1 setLocalDescription start');
      this.pc1.setLocalDescription(desc, () => this.onSetLocalSuccess(this.pc1), this.onSetSessionDescriptionError);
      console.log('pc2 setRemoteDescription start');
      this.pc2.setRemoteDescription(desc, () => this.onSetRemoteSuccess(this.pc2), this.onSetSessionDescriptionError);
      console.log('pc2 createAnswer start');
      // Since the 'remote' side has no media stream we need
      // to pass in the right constraints in order for it to
      // accept the incoming offer of audio and video.
      this.pc2.createAnswer(this.onCreateAnswerSuccess, this.onCreateSessionDescriptionError);
    }

    onSetLocalSuccess = (pc) => {
        console.log(`${this.getName(pc)} setLocalDescription complete`);
    }
  
    onSetRemoteSuccess = (pc) => {
        console.log(`${this.getName(pc)} setRemoteDescription complete`);
    }
  
    onSetSessionDescriptionError=(error) =>{
        console.log(`Failed to set session description: ${error.toString()}`);
    }
  
  
   onCreateAnswerSuccess = (desc) => {
    console.log(`Answer from pc2:\n${desc.sdp}`);
    console.log('pc2 setLocalDescription start');
    this.pc2.setLocalDescription(desc, () => this.onSetLocalSuccess(this.pc2), this.onSetSessionDescriptionError);
    console.log('pc1 setRemoteDescription start');
    this.pc1.setRemoteDescription(desc, () => this.onSetRemoteSuccess(this.pc1), this.onSetSessionDescriptionError);
  }

  
  onIceCandidate = (pc, event) => {
      console.log('this is the event candidate');
      console.log(event.candidate)
    this.getOtherPc(pc).addIceCandidate(event.candidate)
        .then(
            () => this.onAddIceCandidateSuccess(pc),
            err => this.onAddIceCandidateError(pc, err)
        );
    console.log(`${this.getName(pc)} ICE candidate: ${event.candidate ? event.candidate.candidate : '(null)'}`);
  }
  
  onAddIceCandidateSuccess = (pc) => {
    console.log(`${this.getName(pc)} addIceCandidate success`);
  }
  
  onAddIceCandidateError = (pc, error) => {
    console.log(`${this.getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
  }
  
  onIceStateChange = (pc, event) => {
    if (pc) {
      console.log(`${this.getName(pc)} ICE state: ${pc.iceConnectionState}`);
      console.log('ICE state change event: ', event);
    }
  }
  
  getName = (pc) => {
    return (pc === this.pc1) ? 'pc1' : 'pc2';
  }
  
  getOtherPc = (pc) => {
    return (pc === this.pc1) ? this.pc2 : this.pc1;
  }

    onBrushSizeSelection = (size) => {
        this.setState({
            brushSize: Number(size.slice(0, size.length - 1)) * brushSize,
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
                touchmove: function() {
    
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
        this.handleChangeBrushColorComplete({ hex: this.state.background });
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

        this.canvas.style.backgroundColor = color.hex;
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
        const streamKey = 'ff9059e0-3fd7-951c-4a61-0551ce605b16';
        const protocol = window.location.protocol.replace('http', 'ws');
        this.wsRef.current = new WebSocket(
          `${protocol}//localhost:3000/rtmp?key=${streamKey}`
        );

        this.canvas = document.getElementsByTagName('canvas')[0];
    
        //this.video = document.getElementsByTagName('video')[0];

        /* this.videoRef.addEventListener('loadedmetadata', function() {
            console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
        }); */
  

        this.canvas.style.backgroundColor = this.state.background;
       
        //sendData()
        console.log('Got stream from canvas');
        this.record();
    }


    createSheet =()=> {
        const ctx = this.canvas.getContext('2d');
        this.fillCanvasBackgroundWithColor(this.canvas, this.state.background);
        const dataURL = this.canvas.toDataURL('image/jpeg', 0.3);
        const sheets = this.state.sheets;

        sheets.push(dataURL);
        // to do: figure out a way to clear using the library
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "white";
        this.canvas.style.backgroundColor = '#fff';
        this.setState({
            sheets,
            background: '#fff',
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
            <img src={colorPalette} onClick={this.openPaletteOptions} className="palette-icon" />
        </div>

        return (<Layout>
           {/*} <Canvas id="blackboard">
            </Canvas>*/}
        <div id="blackboard" className="blackboard"></div>

        <div className="right-nav">
            <SheetNav />
            <PaletteComponent />
        </div>
        {/*<video ref={this.videoRef} playsInline autoPlay></video>*/}
        {this.state.isPaletteOpen && <MixedComponent />}
        {this.state.isPreview && <MixedPreviewComponent />}
        </Layout>)
    }
}
