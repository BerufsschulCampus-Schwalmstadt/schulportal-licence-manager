import React from 'react';

export default function VerticalDivider() {
  return (
    <div
      style={{
        display: 'flex',
        alignSelf: 'stretch',
        margin: '5px 6px',
        borderRadius: '10px',
        width: '2px',
        background: 'rgba(0, 0, 0, 0.18)',
        zIndex: '5',
      }}
    ></div>
  );
}
