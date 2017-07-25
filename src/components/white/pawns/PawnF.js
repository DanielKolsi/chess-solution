import React from 'react';

class PawnF extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    //value: 1,// if eaten, value is 0, of promoted, value is the value of the promoted piece (queen, knight, bishop or rook)
    //row: 2,
      //let col: 1
    }
  }

  getAcceptedMoves() {

    console.log('White Pawn F');
    let acceptedMoves = [];

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

export default PawnF;
