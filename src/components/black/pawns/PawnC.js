import React from 'react';
import Moves from '../../Moves';

class PawnC extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    //value: 1,// if eaten, value is 0, of promoted, value is the value of the promoted piece (queen, knight, bishop or rook)
    //row: 2,
      //let col: 1
    }
  }

  getCandidateMoves(piece, squares, prevMove) {
    console.log('Black Pawn C');
    return this.getCandidateBlackPawnMoves(piece, squares, prevMove);
  }


    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9823)}
        </div>
      );
    }
}

export default PawnC;
