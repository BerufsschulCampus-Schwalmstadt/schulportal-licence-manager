import React from 'react';

export default function HorizontalDivider() {
  return (
    <div
      style={{
        display: 'flex',
        alignSelf: 'stretch',
        margin: '5px 6px',
        borderRadius: '10px',
        height: '2px',
        background: 'rgba(0, 0, 0, 0.18)',
      }}
    ></div>
  );
}
