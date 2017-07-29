import React from 'react';
import Moves from '../../Moves';

class BishopC extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  getAcceptedMoves(piece, squares) {
    console.log('White Bishop C');
    return this.getBishopMoves(piece, squares);
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
