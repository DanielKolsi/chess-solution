

import React from 'react';

class PawnB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    //value: 1,// if eaten, value is 0, of promoted, value is the value of the promoted piece (queen, knight, bishop or rook)
    //row: 2,
      //let col: 1
    }
  }

    getValidMoves() {
      // el passe
      let validMoves = 1; // row + 2  OR row + 1, col + 1 (eat)
      return validMoves;
    }


    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9823)}
        </div>
      );
    }
}

export default PawnB;
