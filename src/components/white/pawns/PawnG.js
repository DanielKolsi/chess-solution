import React from 'react';
import Moves from '../../Moves';

class PawnG extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    //value: 1,// if eaten, value is 0, of promoted, value is the value of the promoted piece (queen, knight, bishop or rook)
    //row: 2,
      //let col: 1
    }
  }

  getAcceptedMoves(piece, squares) {
    console.log('White Pawn G');
    return this.movePawn(piece, squares);
  }


    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9817)}
        </div>
      );
    }
}

export default PawnG;
