import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './assets/clear.css';
import './assets/font.css';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Missing application mount point');
createRoot(root).render(<App />);
