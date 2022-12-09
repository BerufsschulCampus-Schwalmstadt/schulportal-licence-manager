import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/* Creating a root element and rendering the app into it. */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
