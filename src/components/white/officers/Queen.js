import React from 'react';
import Moves from '../../Moves';

class Queen extends Moves {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getAcceptedMoves(piece, squares) {
    console.log('White Queen');
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
export default Queen;
