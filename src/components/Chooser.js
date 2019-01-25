import React, { Component } from 'react';
import './Chooser.css';

class Chooser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      beards: [
        { x: 0, y: 2 },
        { x: -74, y: 2 },
        { x: 0, y: -33 },
        { x: -74, y: -33 },
        { x: 0, y: -67 },
        { x: -74, y: -67 },
        { x: 0, y: -101 },
        { x: -74, y: -104 },
        { x: 0, y: -138 },
        { x: -74, y: -138 },
        { x: -2, y: -173 },
      ],
      current: 0,
    };
  }

  toggleExpand() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  selectBeard(index) {
    this.setState({ current: index });
    this.props.onChange(this.state.beards[index]);
  }

  render() {
    const { isExpanded, beards, current } = this.state;
    return (
      <div className={`chooser-container ${isExpanded ? 'expanded' : ''}`}>
        <div className="chooser-title"
          onClick={() => this.toggleExpand()}>{isExpanded ? 'Hide Options' : 'Choose A Beard'}</div>
        <ul className="deco-list">
          {beards.map((beard, index) =>
            <li key={index}
              className={`deco-item ${current === index ? 'current' : ''}`}
              style={{backgroundPosition: `${beard.x}px ${beard.y}px`}}
              onClick={() => this.selectBeard(index)}></li>
          )}
        </ul>
      </div>
    );
  }
}

export default Chooser;
