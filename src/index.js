import React from 'react';
import './styles/index.css';
import App from './App';
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');
const rootInstance = createRoot(root);
rootInstance.render(<App />);