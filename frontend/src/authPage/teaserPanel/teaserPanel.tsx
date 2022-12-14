import React from 'react';
import teaserImg from '../../imgs/dashboardTeaser2.svg';
import './teaserPanel.css';

// ---------------------------  function component ------------------------------//

/**
 * It returns a div with some text and an image
 * @returns A div with a paragraph, two headings, and an image.
 */
export default function TeaserPanel() {
  return (
    <div id="leftPanelWrapper">
      <p id="appNameText">Spectrum Downloader</p>
      <div id="leftHeadingsContainer">
        <h2>JOYR makes handling your licences easy!</h2>
        <h3>
          Create an account and watch your tedious, licence maintenance tasks
          become a breeze as we migrate, manage and provide insights for you.
          With JOYR you can put the saved time back to things that matter!
        </h3>
      </div>
      <img id="bottomCardImg" src={teaserImg} alt="SMS to CSV export graphic" />
    </div>
  );
}
