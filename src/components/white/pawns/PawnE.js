import React from 'react';
import Moves from '../../Moves';

class PawnE extends Moves {
  constructor(props) {
    super(props);
    this.state = {
      formerPosition: 52
    //value: 1,// if eaten, value is 0, of promoted, value is the value of the promoted piece (queen, knight, bishop or rook)
    //row: 2,
      //let col: 1
    }
  }

  getCandidateMoves(piece, squares, prevMove) {
    console.log('White Pawn E');
    return this.getCandidateWhitePawnMoves(piece, squares, prevMove);
  }


    render() {
      return (
        <div className="piece">
          {'e'}
        </div>
      );
    }
}

export default PawnE;
