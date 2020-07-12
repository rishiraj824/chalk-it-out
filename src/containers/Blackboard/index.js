import ClickedOutside from '@bit/rishiraj824.react-components.clicked-outside';
import { isUndefined } from 'litedash';
import React, { Component } from 'react';
import { CirclePicker } from 'react-color';
import { withRouter } from 'react-router-dom';
import BrushSizeComponent from '../../components/brush-size';
import background from '../../images/background.svg';
import brush from '../../images/brush.svg';
import colorPicker from '../../images/color-picker.svg';
import eraser from '../../images/eraser.svg';
import colorPalette from '../../images/paint-palette.svg';
import Sketch from '../../lib/index';
import Layout from '../Layout';
import './Blackboard.css';

const brushSize = 5;

class Blackboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sheets: [],
      isPreview: false,
      isPaletteOpen: false,
      selectedOption: '',
      color: '#E3EB64',
      background: '#ffffff',
      brushSize: 5,
      paletteOptions: [
        {
          name: 'bSize',
          component: () => (
            <BrushSizeComponent
              onSelection={this.onBrushSizeSelection}
            />
          ),
          icon: brush,
        },
        {
          name: 'bColor',
          component: () => (
            <CirclePicker
              onChangeComplete={this.handleChangeBrushColorComplete}
            />
          ),
          icon: colorPicker,
        },
        {
          name: 'background',
          component: () => (
            <CirclePicker
              onChangeComplete={this.handleChangeBackgroundComplete}
            />
          ),
          icon: background,
        },
        {
          name: 'eraser',
          icon: eraser,
        },
      ],
      connected: false,
      setStreaming: false,
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
  };

  stopStreaming = () => {
    if (this.mediaRecorderRef.current.state !== 'inactive') {
      this.mediaRecorderRef.current.stop();
    }
  };

  record = () => {
    console.log('Starting record');
    this.startTime = window.performance.now();

    const { match } = this.props;
    const lectureName = match.params.lectureName;

    const user = JSON.parse(localStorage.getItem('user'));

    this.wsRef.current.addEventListener('open', () => {
      this.setState({
        connected: true,
        setStreaming: false,
      });

      const event = {
        event: 'join',
        groupName: lectureName,
        name: user.name,
      };
      this.wsRef.current.send(JSON.stringify(event));
    });

    this.wsRef.current.addEventListener('close', () => {
      this.setState({
        connected: false,
      });
      this.stopStreaming();
    });
    this.stream = this.canvas.captureStream(30);

    const outputStream = new MediaStream();
    this.stream.getTracks().forEach((track) => {
      outputStream.addTrack(track, this.stream);
    });
    
    this.mediaRecorderRef.current = new MediaRecorder(outputStream, {
      mimeType: 'video/webm',
      videoBitsPerSecond: 3000000,
    });
    console.log(this.mediaRecorderRef);
    this.mediaRecorderRef.current.addEventListener(
      'dataavailable',
      (e) => {
        if (this.state.connected) {
          console.log(e.data);
          this.wsRef.current.send(e.data);
        }
      },
    );

    this.mediaRecorderRef.current.addEventListener('stop', () => {
      this.stopStreaming();
      this.wsRef.current.close();
    });

    this.mediaRecorderRef.current.start(1000);
  };

  onBrushSizeSelection = (size) => {
    this.setState({
      brushSize: Number(size.slice(0, size.length - 1)) * brushSize,
      isPaletteOpen: false,
      selectedOption: '',
    });
  };

  togglePalette = () =>
    this.setState({ isPaletteOpen: !this.state.isPaletteOpen });

  closePalette = () => this.setState({ isPaletteOpen: false });

  getBlackboard = () => {
    /*const COLOURS = [ '#E3EB64', '#A7EBCA', '#FFFFFF', '#D8EBA7', '#868E80' ];*/

    let self = this;
    let radius = self.state.brushSize;
    let background = self.state.background;

    Sketch.create({
      container: document.getElementById('blackboard'),
      autoclear: false,
      background: self.state.background,
      /*type: 'WEB_GL',*/
      retina: 'auto',

      setup: function () {
        console.log('setup');
      },
      update: function () {
        radius = self.state.brushSize;
        background = self.state.background;
      },
      // Event handlers

      keydown: function () {
        if (this.keys.C) this.clear();
      },

      // Mouse & touch events are merged, so handling touch events by default
      // and powering sketches using the touches array is recommended for easy
      // scalability. If you only need to handle the mouse / desktop browsers,
      // use the 0th touch element and you get wider device support for free.
      touchmove: function () {
        for (var i = this.touches.length - 1, touch; i >= 0; i--) {
          touch = this.touches[i];

          this.lineCap = 'round';
          this.lineJoin = 'round';
          this.fillStyle = this.strokeStyle = self.state.color;
          this.lineWidth = radius;

          this.beginPath();
          this.moveTo(touch.ox, touch.oy);
          this.lineTo(touch.x, touch.y);
          this.stroke();
        }
      },
    });
  };

  eraser = () => {
    this.onBrushSizeSelection('2x');
    this.handleChangeBrushColorComplete({
      hex: this.state.background,
    });
  };
  selectPaletteOption = (option) =>
    this.setState({ selectedOption: option });

  // credits to https://stackoverflow.com/a/50126796/3971360
  fillCanvasBackgroundWithColor = (canvas, color) => {
    const context = canvas.getContext('2d');

    context.save();

    context.globalCompositeOperation = 'destination-over';

    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.restore();
  };
  handleChangeBackgroundComplete = (color, event) => {
    this.setState({
      background: color.hex,
      selectedOption: '',
      isPaletteOpen: false,
    });
    // to do: use the sketch library to do this

    this.canvas.style.backgroundColor = color.hex;
  };

  handleChangeBrushColorComplete = (color, event) => {
    this.setState({
      color: color.hex,
      selectedOption: '',
      isPaletteOpen: false,
    });
  };

  openPaletteOptions = () => {
    const { paletteOptions: options, selectedOption } = this.state;
    return options.map((option) => {
      return (
        <React.Fragment key={option.name}>
          {option.component && selectedOption === option.name ? (
            <div className="option-container">
              <option.component />
            </div>
          ) : (
            ''
          )}
          <img
            onClick={
              option.name === 'eraser'
                ? this.eraser.bind(this)
                : this.selectPaletteOption.bind(this, option.name)
            }
            className="palette-option-image"
            src={option.icon}
            alt={option.name}
          />
        </React.Fragment>
      );
    });
  };
  componentDidMount() {
    this.getBlackboard();
    const { match, location, history } = this.props;

    const streamKey = match.params.key;
    const streamId = match.params.id;

    const protocol = window.location.protocol.replace('http', 'ws');
    this.wsRef.current = new WebSocket(
      `${protocol}//localhost:3002/rtmp?key=${streamKey}&id=${streamId}`,
    );

    this.canvas = document.getElementsByTagName('canvas')[0];

    this.canvas.style.backgroundColor = this.state.background;

    this.record();
  }

  createSheet = () => {
    const ctx = this.canvas.getContext('2d');
    this.fillCanvasBackgroundWithColor(
      this.canvas,
      this.state.background,
    );
    const dataURL = this.canvas.toDataURL('image/jpeg', 0.3);
    const sheets = this.state.sheets;

    sheets.push(dataURL);
    // to do: figure out a way to clear using the library
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = 'white';
    this.canvas.style.backgroundColor = '#fff';
    this.setState({
      sheets,
      background: '#fff',
    });
  };

  showPreview = (selectedSheet) => {
    this.setState({
      isPreview: true,
      selectedSheet,
    });
  };

  closePreview = () => {
    this.setState({
      isPreview: false,
    });
  };

  render() {
    const sheets = this.state.sheets;

    const { match } = this.props;
    const lectureName = match.params.lectureName;

    const SheetNav = () => (
      <React.Fragment>
        {sheets.map((sheet, i) => (
          <div
            key={`sheet${i}`}
            className="sheet-nav"
            onClick={this.showPreview.bind(this, sheet)}
          >
            <img className="sheet-nav-image" src={sheet} />
          </div>
        ))}
        <div
          className="sheet-nav create-sheet"
          onClick={this.createSheet}
        >
          +
        </div>
      </React.Fragment>
    );

    const Preview = () => (
      <React.Fragment>
        <div className="overlay" onClick={this.closePreview}></div>
        <div className="preview">
          <img
            className="preview-sheet-image"
            src={this.state.selectedSheet}
          />
        </div>
      </React.Fragment>
    );

    const PaletteOptions = () => (
      <React.Fragment>{this.openPaletteOptions()}</React.Fragment>
    );

    const MixedPreviewComponent = ClickedOutside({
      component: Preview,
      props: {
        className: 'modal-preview',
        close: this.closePreview,
      },
    });

    const MixedComponent = ClickedOutside({
      component: PaletteOptions,
      props: {
        className: 'palette-options',
        close: this.closePalette,
      },
    });

    const PaletteComponent = () => (
      <div className="palette" onClick={this.togglePalette}>
        <img
          src={colorPalette}
          onClick={this.openPaletteOptions}
          className="palette-icon"
        />
      </div>
    );

    const streamKey = match.params.key;
    const streamId = match.params.id;

    if (!isUndefined(streamKey) && !isUndefined(streamId)) {
      return (
        <Layout>
          <div id="blackboard" className="blackboard"></div>
          <div className="right-nav">
            <SheetNav />
            <PaletteComponent />
          </div>
          {this.state.isPaletteOpen && <MixedComponent />}
          {this.state.isPreview && <MixedPreviewComponent />}
        </Layout>
      );
    } else {
      return (
        <Layout>
          <h3>Please check the URL and try again.</h3>
        </Layout>
      );
    }
  }
}

export default withRouter(Blackboard);
