import React from 'react';
import Moves from '../../Moves';

class KnightB extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getCandidateMoves(piece, squares) {
    
    if (piece.value !== -3) return undefined;
    return this.getCandidateKnightMoves(piece, squares);
  }

    render() {
      const divStyle = {
        fontSize: 85,
      };
      return (
        <div style={divStyle} className="piece">
          {String.fromCharCode(9822)}
        </div>
      );
    }
}
export default KnightB;
