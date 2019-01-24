import React, { Component } from 'react';
import './Recorder.css';
import hatOne from '../assets/images/hats/hat-3.png';

const hatImage = new Image();
hatImage.src = hatOne;

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isInfo: false,
      isSupported: false,
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
    const { innerWidth, innerHeight } = window;
    const constraints = {
      audio: false,
      video: {
        facingMode: 'user',
        width: innerWidth,
        height: innerHeight,
      },
    };
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
      const { canvas, ctx } = this;
      console.log(this.ctx);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      faces.forEach(face => {
        const { width, height, top, left } = face.boundingBox;
        const size = width * 0.4;
        // ctx.strokeRect(left, top, width, height);
        ctx.drawImage(hatImage, left + width / 2 - size / 2, top - size - height / 4, size, size);
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

  toggleInfo() {
    this.setState({ isInfo: !this.state.isInfo });
  }

  render() {
    const { isOpen, isInfo, isSupported } = this.state;
    return (
      <div className="recorder-container">
        <video className={`camera-video ${isOpen ? 'active' : ''}`} ref="cameraVideo" autoPlay></video>
        <canvas className={`camera-canvas ${isOpen ? 'active' : ''}`} ref="cameraCanvas"></canvas>
        {isOpen ?
          <div className="icon-close" onClick={() => this.closeCamera()}></div> :
          <div className="icon-open" onClick={() => this.openCamera()}></div>
        }
        {isSupported ? '' :
          <div className={`feature-info ${isInfo ? 'active' : ''}`} onClick={() => this.toggleInfo()}>
            <div>Enable FaceDetector</div>
            <div>Please Copy and Visit The URL Below:</div>
            <div><code>chrome://flags/#enable-experimental-web-platform-features</code></div>
          </div>
        }
      </div>
    );
  }
}

export default Recorder;