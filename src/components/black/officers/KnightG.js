import React from 'react';
import Moves from '../../Moves';

class KnightG extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  getCandidateMoves(piece, squares) {
    console.log('Black Knight G');
    return this.getCandidateKnightMoves(piece, squares);
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
