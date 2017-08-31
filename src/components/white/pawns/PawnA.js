import React from 'react';
import Moves from '../../Moves';

class PawnA extends Moves {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('\n**White Pawn A**\n');
    return this.getCandidateWhitePawnMoves(piece, squares, prevMove);
  }

    render(value) {
      //String.fromCharCode(9817
        return (
          <div className="piece">
            {'a'}
          </div>
        );

    }
}

export default PawnA;
