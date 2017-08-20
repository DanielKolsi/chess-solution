import React from 'react';
import Moves from '../../Moves';

class RookH extends Moves {
  constructor(props) {
    super(props);
    this.state = {
      hasMoved: false
    }
  }
  getCandidateMoves(piece, squares) {
    console.log('White Rook H');
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
export default RookH;
