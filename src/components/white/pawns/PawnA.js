

import React from 'react';

class PawnA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      test: false
    //value: 1,// if eaten, value is 0, of promoted, value is the value of the promoted piece (queen, knight, bishop or rook)
    //row: 2,
      //let col: 1
    }
  }

  getAcceptedMoves() {

    console.log('White Pawn A');
    let acceptedMoves = [];

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
