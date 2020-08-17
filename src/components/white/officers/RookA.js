import React from 'react';
import Moves from '../../Moves';

class RookA extends Moves {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  
    getCandidateMoves(piece, squares) {
      return this.getCandidateRookMoves(piece, squares);
    }

    render() {
      const divStyle = {
        color: '#aaaaaa',
        fontSize: 85,
      };
      return (
        <div style={divStyle} className="piece">
          {String.fromCharCode(9814)}
        </div>
      );
    }
}
export default RookA;
