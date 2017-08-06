import React from 'react';
import Moves from '../../Moves';

class QueenA extends Moves {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getAcceptedMoves(piece, squares) {
    console.log('White Queen promoted from pawn A');
    return this.getQueenMoves(piece, squares);
  }

  render() {
    return (
      <div className="piece">
        {String.fromCharCode(9813)}
      </div>
    );
  }
}
export default QueenA;
