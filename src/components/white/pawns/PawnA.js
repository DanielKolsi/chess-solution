

import React from 'react';
import Moves from '../../Moves';

class PawnA extends Moves {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      row: 0,
      col: 0

    //value: 1,// if eaten, value is 0, of promoted, value is the value of the promoted piece (queen, knight, bishop or rook)
    //row: 2,
      //let col: 1
    }
  }

  getAcceptedMoves() {

    console.log('White Pawn A');
    let acceptedMoves = [];
    acceptedMoves = this.movePawn(0, 1, 2, true);
    console.log('move = ' + acceptedMoves[0]);

    return acceptedMoves;
  }

  getAcceptedMoves2(pieceId, squares) {
    const {value, test} = this.state;

    let acceptedMoves = [];
    acceptedMoves.push(squares[55].index);
    this.setState({test: true}, function() { console.log('test = ' + this.state.test); });
    this.setState({value: 55}, function() { console.log('value = ' + this.state.value); });
    return acceptedMoves;
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9817)}
        </div>
      );
    }
}

export default PawnA;
