//import config from './config/normal'; // normal chess board setup
//import config from './config/whiteCastling'; // castling
import config from './config/blackEnPasse'; // en passe white
//import config from "./config/staleMate";



import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./styles/Chess.css";
//require('./styles/chess.scss'); // does the squares!!

ReactDOM.render(
  <App chess={config.pieces} />,
  document.getElementById("root")
);
registerServiceWorker();
