import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { MobileDemo } from './MobileDemo';
import { FlowDemo } from './FlowDemo';
import './styles.css';

const path = window.location.pathname.replace(/\/+$/, '');
const isMobile = path === '/mobile' || path === '/mobile/index.html';
const isFlow = path === '/flow' || path === '/flow/index.html';

const root = isFlow ? <FlowDemo /> : isMobile ? <MobileDemo /> : <App />;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{root}</React.StrictMode>,
);
