import React from 'react';
import Moves from '../../Moves';

class KnightB extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getCandidateMoves(piece, squares, opponentKing, opponentCandidateMove) {
    console.log('White Knight B');
    if (piece.value !== 3) return undefined;
    return this.getCandidateKnightMoves(piece, squares, opponentKing, opponentCandidateMove);
  }
    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9816)}
        </div>
      );
    }
}
export default KnightB;
