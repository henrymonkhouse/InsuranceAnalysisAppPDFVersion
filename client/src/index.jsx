import React from 'react';
import { createRoot } from 'react-dom/client';
import AppWithBooklets from './AppWithBooklets';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithBooklets />
  </React.StrictMode>
);