import React from 'react';
import Moves from '../../Moves';

class Queen extends Moves {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getAcceptedMoves(piece, squares, opponentKing, opponentCandidateMove) {
    console.log('C-testing diagonal UR, opponentKing = ' + opponentKing + ' opponentCandidateMove = ' + opponentCandidateMove);
    console.log('White Queen');
    if (piece.value !== 9) return undefined;
    return this.getQueenMoves(piece, squares, opponentKing, opponentCandidateMove);
  }

  render() {
    return (
      <div className="piece">
        {String.fromCharCode(9813)}
      </div>
    );
  }
}
export default Queen;
