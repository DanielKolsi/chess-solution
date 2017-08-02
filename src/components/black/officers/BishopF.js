import React from 'react';
import Moves from '../../Moves';

class BishopF extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  getAcceptedMoves(piece, squares) {
    console.log('Black Bishop F');
    return this.getBishopMoves(piece, squares);
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9821)}
        </div>
      );
    }
}
export default BishopF;
