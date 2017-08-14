import React from 'react';
import Moves from '../../Moves';

class RookH extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  getAcceptedMoves(piece, squares, opponentKing, opponentCandidateMove) {
    console.log('White Rook H');
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
export default RookH;
