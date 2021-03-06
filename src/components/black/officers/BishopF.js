import React from 'react';
import Moves from '../../Moves';

class BishopF extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  getCandidateMoves(piece, squares) {
    //console.log('Black Bishop F');
    return this.getCandidateBishopMoves(piece, squares);
  }

    render() {
      const divStyle = {
        fontSize: 85,
      };
      return (
        <div style={divStyle} className="piece">
          {String.fromCharCode(9821)}
        </div>
      );
    }
}
export default BishopF;
