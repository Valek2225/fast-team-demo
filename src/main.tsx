import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { MobileDemo } from './MobileDemo';
import './styles.css';

const path = window.location.pathname.replace(/\/+$/, '');
const isMobile = path === '/mobile' || path === '/mobile/index.html';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{isMobile ? <MobileDemo /> : <App />}</React.StrictMode>,
);
