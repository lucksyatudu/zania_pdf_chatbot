import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css'; // Import any global styles
import App from './App'; // Import the main App component

// Mount React app to the 'root' div in public/index.html
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
