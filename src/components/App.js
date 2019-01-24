import React, { Component } from 'react';
import Recorder from './Recorder';
import Chooser from './Chooser';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Recorder />
        <Chooser />
      </div>
    );
  }
}

export default App;
