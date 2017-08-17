import React from 'react';
import Moves from '../../Moves';

class PawnB extends Moves {
  constructor(props) {
    super(props);
    this.state = {
      formerPosition: 49
    //value: 1,// if eaten, value is 0, of promoted, value is the value of the promoted piece (queen, knight, bishop or rook)
    //row: 2,
      //let col: 1
    }
  }

    getCandidateMoves(piece, squares, prevMove) {
      console.log('\n**White Pawn B**\n');
      return this.getCandidateWhitePawnMoves(piece, squares, prevMove);
    }

//{String.fromCharCode(9817)}
    render() {
      return (
        <div className="piece">
          {'b'}
        </div>
      );
    }
}

export default PawnB;
