import React from 'react';
import Moves from '../../Moves';

class BishopF extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  getAcceptedMoves(piece, squares, opponentKing, opponentCandidateMove) {
    console.log('Black Bishop F');
    return this.getCandidateBishopMoves(piece, squares, opponentKing, opponentCandidateMove);
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9821)}
        </div>
      );
    }
}
export default BishopF;
