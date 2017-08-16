import React from 'react';
import Moves from '../../Moves';

class PawnD extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    formerPosition: 51
    //value: 1,// if eaten, value is 0, of promoted, value is the value of the promoted piece (queen, knight, bishop or rook)
    //row: 2,
      //let col: 1
    }
  }

  getCandidateMoves(piece, squares) {
    console.log('White Pawn D');
    return this.getCandidateWhitePawnMoves(piece, squares);
  }
    render() {
      return (
        <div className="piece">
          {'d'}
        </div>
      );
    }
}

export default PawnD;
