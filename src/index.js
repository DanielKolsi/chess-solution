import React from 'react';
import ReactDOM from 'react-dom';

import config from './config/config';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './styles/Chess.css';
//require('./styles/chess.scss'); // does the squares!!

ReactDOM.render(<App setup={config.setup}/>, document.getElementById('root'));
registerServiceWorker();
