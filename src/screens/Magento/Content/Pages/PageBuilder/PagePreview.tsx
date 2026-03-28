// components/PagePreview.jsx
'use client';

import React, { useState } from 'react';

export default function PagePreview() {
  const savedData =
    typeof window !== 'undefined' ? window.localStorage.getItem('savedPage') : null;
  const parsed = savedData ? JSON.parse(savedData) : null;
  const [html] = useState(parsed?.html || '');
  const [css] = useState(parsed?.css || '');
  
  if (!html) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>No page saved yet</h2>
        <p>Create a page using the Page Builder first</p>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => window.location.href = '/builder'} style={buttonStyle}>
          ← Back to Builder
        </button>
      </div>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'auto' }}>
        <style>{css}</style>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  background: '#3498db',
  border: 'none',
  borderRadius: '4px',
  color: 'white',
  cursor: 'pointer',
  fontSize: '14px'
};
