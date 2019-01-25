import React, { Component } from 'react';
import Recorder from './Recorder';
import Chooser from './Chooser';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      beard: { x: 0, y: 0 },
    };
  }

  render() {
    return (
      <div className="App">
        <Recorder beard={this.state.beard} />
        <Chooser onChange={(beard) => this.setState({ beard })} />
      </div>
    );
  }
}

export default App;
