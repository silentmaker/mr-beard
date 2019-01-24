import React, { Component } from 'react';
import './Recorder.css';

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isSupported: false,
      mediaStream: null,
      faceDetector: new window.FaceDetector(),
    };
  }

  openCamera() {
    const { devicePixelRatio, innerWidth, innerHeight } = window;
    const constraints = {
      audio: false,
      video: {
        facingMode: 'user',
        width: innerHeight * devicePixelRatio,
        height: innerWidth * devicePixelRatio,
      },
    };
    const camera = window.navigator.mediaDevices.getUserMedia(constraints);
    camera.then((mediaStream) => {
      this.refs.cameraVideo.srcObject = mediaStream;
      this.setState({ isOpen: true, mediaStream });
      requestAnimationFrame(() => this.detectFace());
    }).catch((err) => {
      console.log(`${err.name}: ${err.message}`);
    });
  }

  detectFace() {
    this.state.faceDetector.detect(this.refs.cameraVideo).then((faces) => {
      const canvas = this.refs.cameraCanvas;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      faces.forEach(face => {
        console.log(face);
        const { width, height, top, left } = face.boundingBox;
        context.fillStyle = "green";
        context.fillRect(top, left, width, height);
      });
      if (this.state.isOpen) requestAnimationFrame(() => this.detectFace());
    }).catch((err) => {
      console.log(`${err.name}: ${err.message}`);
    });
  }

  closeCamera() {
    if (this.state.mediaStream) {
      this.state.mediaStream.getTracks().forEach(track => track.stop());
      this.setState({ isOpen: false });
    }
  }

  toggleInfo() {
    this.setState({ isSupported: !this.state.isSupported });
  }

  render() {
    const { isOpen, isSupported, faceDetector } = this.state;
    return (
      <div className="recorder-container">
        <video className={`camera-video ${isOpen ? 'active' : ''}`} ref="cameraVideo" autoPlay></video>
        <canvas className={`camera-canvas ${isOpen ? 'active' : ''}`} ref="cameraCanvas"></canvas>
        {isOpen ?
          <div className="icon-close" onClick={() => this.closeCamera()}></div> :
          <div className="icon-open" onClick={() => this.openCamera()}></div>
        }
        {faceDetector ? '' :
          <div className={`feature-info ${isSupported ? 'active' : ''}`} onClick={() => this.toggleInfo()}>
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
