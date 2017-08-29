import React from 'react';
import Moves from '../../Moves';

class PawnC extends Moves {
  constructor(props) {
    super(props);
    this.state = {
  
    }
  }

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('White Pawn C');
    return this.getCandidateWhitePawnMoves(piece, squares, prevMove);
  }

    render() {
      return (
        <div className="piece">
          {'c'}
        </div>
      );
    }
}

export default PawnC;
