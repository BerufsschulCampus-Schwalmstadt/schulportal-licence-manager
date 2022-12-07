import React, {Component} from 'react';
import bottomCardImg from './imgs/LeftPanelLogo.svg';
import './leftPanel.css';

export default class leftPanel extends Component {
  render() {
    return (
      <div id="leftPanelWrapper">
        <p id="appNameText">Spectrum Downloader</p>
        <div id="leftHeadingsContainer">
          <h1>Let’s export your License applications!</h1>
          <h2>
            Login using your Spectrum management System credentials and we’ll
            export all your active license applications as a csv.
          </h2>
        </div>
        <div id="bottomCardImgContainer">
          <img src={bottomCardImg} alt="SMS to CSV export graphic" />
        </div>
      </div>
    );
  }
}
