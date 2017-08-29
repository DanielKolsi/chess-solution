import React from 'react';
import Moves from '../../Moves';

class PawnF extends Moves {
  constructor(props) {
    super(props);
    this.state = {      
    }
  }

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('White Pawn F');
    return this.getCandidateWhitePawnMoves(piece, squares, prevMove);
  }
    render() {
      return (
        <div className="piece">
          {'f'}
        </div>
      );
    }
}

export default PawnF;
