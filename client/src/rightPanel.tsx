import React, {Component} from 'react';
import LoginForm from './loginForm';
import './rightPanel.css';

export default class rightPanel extends Component {
  render() {
    return (
      <div id="rightPanelWrapper">
        <LoginForm />
      </div>
    );
  }
}