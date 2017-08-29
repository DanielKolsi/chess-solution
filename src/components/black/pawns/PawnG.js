import React from 'react';
import Moves from '../../Moves';

class PawnG extends Moves {
  constructor(props) {
    super(props);
    this.state = {    
    }
  }

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('Black Pawn G');
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

export default PawnG;
