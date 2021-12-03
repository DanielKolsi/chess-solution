import React from 'react';


class KnightB extends React.Component {
  

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
