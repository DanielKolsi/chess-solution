import React from 'react';
import Moves from '../../Moves';

class BishopF extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getAcceptedMoves(piece, squares, opponentKing, opponentCandidateMove) {
    console.log('White Bishop F');
    return this.getBishopMoves(piece, squares, opponentKing, opponentCandidateMove);
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9815)}
        </div>
      );
    }
}
export default BishopF;
