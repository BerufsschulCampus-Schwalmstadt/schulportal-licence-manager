import React from 'react';
import LeftPanel from './leftPanel';
import RightPanel from './rightPanel';
import './App.css';

function App() {
  return (
    <div id="appWrapper">
      <LeftPanel />
      <RightPanel />
    </div>
  );
}

export default App;
