import React from "react";
//import config from './config/normal'; // normal chess board setup
//import config from './config/whiteCastling'; // castling
//import config from './config/whiteCanCaptureWithEnPassant';
//import config from "./config/staleMate";
//import config from "./config/bugWhiteBishopCapturesKing";

//import config from "./config/bugWhiteKingMovesToCheckByBlackBishop"; // fixed 27.10.21
//import config from "./config/generalBugFixing";
import config from "./config/549";
//import config from "./config/60";
//mport config from "./config/threatScoresDebug";

//import ReactDOM from "react-dom";

import { createRoot } from "react-dom/client";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./styles/Chess.css";
const container = document.getElementById("root");

//require('./styles/chess.scss'); // does the squares!!
//const root = ReactDOM.createRoot(document.getElementById("root"));
//const rootElement = document.getElementById("root");
//const root = createRoot(rootElement);

//root.render(<App chess={config.pieces} />);

const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App chess={config.pieces} />);

//ReactDOM.render(<App chess={config.pieces} />, document.getElementById("root"));
registerServiceWorker();
