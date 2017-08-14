import React from 'react';
import Moves from '../../Moves';

class KnightB extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getAcceptedMoves(piece, squares, opponentKing) {

    console.log('\n **Black Knight B** value = ' + piece.value + ' location = ' + piece.location + ' \n');
    if (piece.value !== -3) return undefined;
    return this.getKnightMoves(piece, squares, opponentKing);
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9822)}
        </div>
      );
    }
}
export default KnightB;
