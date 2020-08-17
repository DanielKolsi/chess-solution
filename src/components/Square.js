import React from 'react';

// import white pawns
import PawnWA from './white/pawns/PawnA';
import PawnWB from './white/pawns/PawnB';
import PawnWC from './white/pawns/PawnC';
import PawnWD from './white/pawns/PawnD';
import PawnWE from './white/pawns/PawnE';
import PawnWF from './white/pawns/PawnF';
import PawnWG from './white/pawns/PawnG';
import PawnWH from './white/pawns/PawnH';

//import white officers
import KingW from './white/officers/King';
import QueenW from './white/officers/Queen';
import BishopWC from './white/officers/BishopC';
import BishopWF from './white/officers/BishopF';
import KnightWB from './white/officers/KnightB';
import KnightWG from './white/officers/KnightG';
import RookWA from './white/officers/RookA';
import RookWH from './white/officers/RookH';

// import black pawns
import PawnBA from './black/pawns/PawnA';
import PawnBB from './black/pawns/PawnB';
import PawnBC from './black/pawns/PawnC';
import PawnBD from './black/pawns/PawnD';
import PawnBE from './black/pawns/PawnE';
import PawnBF from './black/pawns/PawnF';
import PawnBG from './black/pawns/PawnG';
import PawnBH from './black/pawns/PawnH';

//import black officers
import KingB from './black/officers/King';
import QueenB from './black/officers/Queen';
import BishopBC from './black/officers/BishopC';
import BishopBF from './black/officers/BishopF';
import KnightBB from './black/officers/KnightB';
import KnightBG from './black/officers/KnightG';
import RookBA from './black/officers/RookA';
import RookBH from './black/officers/RookH';

// import promotions
import QueenW2 from './white/officers/Queen2';
import QueenW3 from './white/officers/Queen3';
import QueenW4 from './white/officers/Queen4';
import QueenW5 from './white/officers/Queen5';
import KnightW3 from './white/officers/Knight3'; // for underpromotion


import QueenB2 from './black/officers/Queen2';
import QueenB3 from './black/officers/Queen3';
import KnightB3 from './black/officers/Knight3'; // for underpromotion

//import PropTypes from 'prop-types'; // ES6

const pieces = {
  KingW, QueenW, BishopWC, BishopWF, KnightWB, KnightWG,
  RookWA, RookWH, PawnWA, PawnWB, PawnWC, PawnWD, PawnWE,
  PawnWF, PawnWG, PawnWH,
  KingB, QueenB, BishopBC, BishopBF, KnightBB, KnightBG,
  RookBA, RookBH, PawnBA, PawnBB, PawnBC, PawnBD, PawnBE,
  PawnBF, PawnBG, PawnBH,
  QueenW2, QueenW3, QueenW4, QueenW5, KnightW3, QueenB2, QueenB3, KnightB3
};

class Square extends React.Component {
  
  render() {
    
    let {piece} = this.props;
    
    piece = (piece) ? React.createElement(pieces[piece.type], {ref: 'piece', type: piece.type, white: piece.white, currentSquare: piece.currentSquare, n: piece.n}) : '';
    
    return (
      <div className="square">
        {this.props.index}         
        {piece}         
      </div>
    );
  }
}

export default Square;
