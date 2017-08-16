import React from 'react';
import Moves from '../../Moves';

class PawnA extends Moves {
  constructor(props) {
    super(props);
    this.state = {
      formerPosition: 48,
      value: 1,
      row: 0,
      col: 0
    //value: 1,// if eaten, value is 0, of promoted, value is the value of the promoted piece (queen, knight, bishop or rook)
    //row: 2,
      //let col: 1
    }
  }

  getCandidateMoves(piece, squares, opponentKing, opponentCandidateMove) {
    return this.getCandidateWhitePawnMoves(piece, squares, opponentKing, opponentCandidateMove);
  }

    render(value) {
      //String.fromCharCode(9817

        return (
          <div className="piece">
            {(this.state.value === 1) ? 'a' : String.fromCharCode(9813) }
          </div>
        );

    }
}

export default PawnA;
