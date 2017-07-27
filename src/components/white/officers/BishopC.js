import React from 'react';
import Moves from '../../Moves';

class BishopC extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getAcceptedMoves() {

    console.log('White Bishop C');
    let acceptedMoves = [];

    return acceptedMoves;
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9815)}
        </div>
      );
    }
}
export default BishopC;
