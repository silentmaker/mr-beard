import React, { Component } from 'react';
import './Recorder.css';
import beardSprite from '../assets/images/sprite-beards.png';

const beardImage = new Image();
beardImage.src = beardSprite;

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isInfo: false,
      isSupported: false,
      isCapture: false,
      screenshot: '',
    };
  }

  componentDidMount() {
    this.mediaStream = null;
    this.faceDetector = window.FaceDetector ? new window.FaceDetector() : null;
    this.video = this.refs.cameraVideo;
    this.canvas = this.refs.cameraCanvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.setState({ isSupported: this.faceDetector });
  }

  openCamera() {
    const constraints = { audio: false, video: { facingMode: 'user' } };
    const camera = window.navigator.mediaDevices.getUserMedia(constraints);
    camera.then((mediaStream) => {
      const { video } = this;
      video.onloadedmetadata = () => {
        video.play();
        requestAnimationFrame(() => this.detectFace());
      };
      video.srcObject = mediaStream;
      this.setState({ isOpen: true });
      this.mediaStream = mediaStream;
    }).catch((err) => {
      console.log(`${err.name}: ${err.message}`);
    });
  }

  detectFace() {
    if (!this.faceDetector) return;
    this.faceDetector.detect(this.refs.cameraVideo).then((faces) => {
      const { canvas, video, ctx } = this;
      const { isCapture } = this.state;
      const { beard } = this.props;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      faces.forEach(face => {
        const { height } = face.boundingBox;
        face.landmarks.forEach((landmark) => {
          if (landmark.type === 'mouth') {
            const { x, y } = landmark.locations[0];
            if (isCapture) ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            ctx.drawImage(beardImage, -beard.x * 2, -beard.y * 2, 150, 80, x - 75, y - height / 200 * 80, 150, 80);
            if (isCapture) this.setState({ isCapture: false, screenshot: canvas.toDataURL('image/png') });
          }
        });
      });
      if (this.state.isOpen) requestAnimationFrame(() => this.detectFace());
    }).catch((err) => {
      console.log(`${err.name}: ${err.message}`);
    });
  }

  closeCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.setState({ isOpen: false });
    }
  }

  captureCamera() {
    this.setState({ isCapture: !this.state.isCapture });    
  }

  toggleInfo() {
    this.setState({ isInfo: !this.state.isInfo });
  }

  clearPhoto() {
    setTimeout(() => {
      this.setState({ screenshot: '' });
    }, 2000);
  }

  render() {
    const { isOpen, isInfo, isSupported, screenshot } = this.state;
    return (
      <div className="recorder-container">
        <video className={`camera-video ${isOpen ? 'active' : ''}`} ref="cameraVideo" autoPlay></video>
        <canvas className={`camera-canvas ${isOpen ? 'active' : ''}`} ref="cameraCanvas"></canvas>
        {isOpen ?
          <div className="icon-close" onClick={() => this.closeCamera()}></div> :
          <div className="icon-open" onClick={() => this.openCamera()}></div>
        }
        {!isOpen ? '' :
          <div className="icon-capture" onClick={() => this.captureCamera()}></div>
        }
        {isSupported ? '' :
          <div className={`feature-info ${isInfo ? 'active' : ''}`} onClick={() => this.toggleInfo()}>
            <div>Enable FaceDetector</div>
            <div>Please Copy and Visit The URL Below:</div>
            <div><code>chrome://flags/#enable-experimental-web-platform-features</code></div>
          </div>
        }
        <a className={`save-btn ${screenshot ? 'active' : ''}`} href={screenshot} download="mr-beard.png">
          <img src={screenshot} alt="mr-beard.png" onClick={() => this.clearPhoto()}/>
        </a>
      </div>
    );
  }
}

export default Recorder;
