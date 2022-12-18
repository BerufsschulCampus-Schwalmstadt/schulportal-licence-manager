import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals/global-styles.css';
import App from './globals/app';

export const userContext = React.createContext({});
/* Creating a root element and rendering the app into it. */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
