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

  getAcceptedMoves(piece, squares) {
    console.log('White Pawn A');

    return this.getWhitePawnMoves(piece, squares);
  }
  getAcceptedMovesQueen(piece, squares) {
    console.log('White Pawn A promoted to Queen');
    return this.getQueenMoves(piece, squares);
  }

  promote(value) {
    console.log('White Pawn A promoted to Queen, value = ' + value);
    this.setState({value: value}, function () {
        console.log('VALUE  = ' + this.state.value);
    });

  }
    render(value) {
      console.log('rendering, value = ' + this.state.value);

        return (
          <div className="piece">
            {(this.state.value === 1) ? String.fromCharCode(9817) : String.fromCharCode(9813) }
          </div>
        );

    }
}

export default PawnA;
