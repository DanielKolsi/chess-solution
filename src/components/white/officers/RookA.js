import React from 'react';
import Moves from '../../Moves';

class RookA extends Moves {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  
    getCandidateMoves(piece, squares) {
      console.log('White Rook A');
      return this.getCandidateRookMoves(piece, squares, 'R');
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
