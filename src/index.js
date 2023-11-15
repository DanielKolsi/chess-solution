//import config from './config/normal'; // normal chess board setup
//import config from './config/whiteCastling'; // castling
//import config from './config/whiteCanCaptureWithEnPassant'; 
//import config from "./config/staleMate";
//import config from "./config/bugWhiteBishopCapturesKing";

//import config from "./config/bugWhiteKingMovesToCheckByBlackBishop"; // fixed 27.10.21
//import config from "./config/generalBugFixing";
//import config from "./config/549"; 
import config from "./config/60"; 
//import config from "./config/threatScoresDebug"; 
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
