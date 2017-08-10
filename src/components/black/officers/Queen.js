import React from 'react';
import Moves from '../../Moves';

class Queen extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getAcceptedMoves(piece, squares, opponentKing, opponentCandidateMove) {
    console.log('Black Queen');
    return this.getQueenMoves(piece, squares);
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9819)}
        </div>
      );
    }
}
export default Queen;
