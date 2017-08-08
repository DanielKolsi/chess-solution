import React from 'react';
import Moves from '../../Moves';

class Queen2 extends Moves {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getAcceptedMoves(piece, squares) {
    console.log('Black Queen2');
    if (piece.value !== -9) return undefined;
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
export default Queen2;
