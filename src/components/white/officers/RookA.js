import React from 'react';
import Moves from '../../Moves';

class RookA extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
    getAcceptedMoves(piece, squares, opponentKing, opponentCandidateMove) {
      console.log('White Rook A');
      return this.getRookMoves(piece, squares, opponentKing, opponentCandidateMove);
    }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9814)}
        </div>
      );
    }
}
export default RookA;
