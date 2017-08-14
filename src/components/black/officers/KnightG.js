import React from 'react';
import Moves from '../../Moves';

class KnightG extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  getAcceptedMoves(piece, squares, opponentKing, opponentCandidateMove) {
    console.log('Black Knight G');
    return this.getKnightMoves(piece, squares, opponentKing, opponentCandidateMove);
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9822)}
        </div>
      );
    }
}
export default KnightG;
