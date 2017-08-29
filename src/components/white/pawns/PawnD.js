import React from 'react';
import Moves from '../../Moves';

class PawnD extends Moves {
  constructor(props) {
    super(props);
    this.state = {    
    }
  }

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('White Pawn D');
    return this.getCandidateWhitePawnMoves(piece, squares, prevMove);
  }
    render() {
      return (
        <div className="piece">
          {'d'}
        </div>
      );
    }
}

export default PawnD;
