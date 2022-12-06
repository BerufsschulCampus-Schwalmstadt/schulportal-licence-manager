import React, {Component} from 'react';
import LoginForm from './loginForm';
import headerImage from './imgs/RightPanelLogo.svg';
import './rightPanel.css';

export default class rightPanel extends Component {
  render() {
    return (
      <div id="rightPanelWrapper">
        <div id="headerImageWrapper">
          <img src={headerImage} alt="headerImage" />
        </div>
        <LoginForm />
      </div>
    );
  }
}
