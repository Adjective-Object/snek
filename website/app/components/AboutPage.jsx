import React, { Component } from 'react';
import AboutContent from './about.md';

export default class AboutPage extends Component {
  render() {
    return (
            <div className="markdown-container">
                <AboutContent />
            </div>
        );
  }
}
