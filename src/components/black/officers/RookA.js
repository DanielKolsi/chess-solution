import React from 'react';
import Moves from '../../Moves';

class RookA extends Moves {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  getCandidateMoves(piece, squares) {
    console.log('Black Rook A');
    return this.getCandidateRookMoves(piece, squares);
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9820)}
        </div>
      );
    }
}
export default RookA;
