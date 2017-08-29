import React from 'react';
import Moves from '../../Moves';

class PawnH extends Moves {
  constructor(props) {
    super(props);
    this.state = {      
    }
  }

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('White Pawn H');
    return this.getCandidateWhitePawnMoves(piece, squares, prevMove);
  }

    render() {
      return (
        <div className="piece">
          {'h'}
        </div>
      );
    }
}

export default PawnH;
