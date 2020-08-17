import React from 'react';
import Moves from '../../Moves';

class PawnH extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    //value: 1,// if eaten, value is 0, of promoted, value is the value of the promoted piece (queen, knight, bishop or rook)
    //row: 2,
      //let col: 1
    }
  }

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('Black Pawn H');
    return this.getCandidateBlackPawnMoves(piece, squares, prevMove);
  }


    render() {
      const divStyle = {
        fontSize: 80,
      };
      return (
        <div style={divStyle} className="piece">
          {String.fromCharCode(9823)}
        </div>
      );
    }
}

export default PawnH;
