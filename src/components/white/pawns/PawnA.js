

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
    this.getAcceptedMoves = this.getAcceptedMoves.bind(this);
  }

  getAcceptedMoves(pieceId, squares) {
    const {value, test} = this.state;

    let acceptedMoves = [];
    acceptedMoves.push(squares[55].index);
    this.setState({test: true});
    this.setState({value: 55});

    return acceptedMoves;
  }

  getState(squares) {
    console.log('white PawnA valid moves, value = ' + squares[55].index + this.state.test);
    console.log('white PawnA valid moves, value = ' + this.state.value);
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
