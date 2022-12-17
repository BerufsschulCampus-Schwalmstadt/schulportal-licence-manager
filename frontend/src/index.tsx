import React from 'react';
import ReactDOM from 'react-dom/client';
import './global-styles.css';
import {RouterProvider} from 'react-router-dom';
import {router} from './router';

export const userContext = React.createContext({});
/* Creating a root element and rendering the app into it. */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
