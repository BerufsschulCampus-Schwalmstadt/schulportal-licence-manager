import React from 'react';
import LoginForm from './loginForm';
import './rightPanel.css';

// ---------------------------  function Component ------------------------------//

/**
 * It returns a div with an id of "rightPanelWrapper" and inside that div is a LoginForm component
 * @returns A div with the id of rightPanelWrapper and a LoginForm component.
 */
export default function rightPanel() {
  return (
    <div id="rightPanelWrapper">
      <LoginForm />
    </div>
  );
}
