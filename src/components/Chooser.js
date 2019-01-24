import React, { Component } from 'react';
import './Chooser.css';
import hatOne from '../assets/images/hats/hat-1.png';
import hatTwo from '../assets/images/hats/hat-2.png';
import hatThree from '../assets/images/hats/hat-3.png';

class Chooser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      hatImages: [hatOne, hatTwo, hatThree],
    };
  }

  toggleExpand() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    const { isExpanded, hatImages } = this.state;
    return (
      <div className={`chooser-container ${isExpanded ? 'expanded' : ''}`}>
        <div className="chooser-title"
          onClick={() => this.toggleExpand()}>{isExpanded ? 'Hide Options' : 'Choose A Hat'}</div>
        <ul className="hat-list">
          {hatImages.map(image =>
            <li className="hat-item" key={image}>
              <img src={image} alt="" />
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default Chooser;
