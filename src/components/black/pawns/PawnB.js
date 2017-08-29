import React from 'react';
import Moves from '../../Moves';

class PawnB extends Moves {
  constructor(props) {
    super(props);
    this.state = {    
    }
  }

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('Black Pawn B');
    return this.getCandidateBlackPawnMoves(piece, squares, prevMove);
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9823)}
        </div>
      );
    }
}

export default PawnB;
