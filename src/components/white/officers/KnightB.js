import React from 'react';

class KnightB extends React.Component {
  

  getCandidateMoves(piece, squares) {
    //console.log('White Knight B');
    if (piece.value !== 3) return undefined;
    return this.getCandidateKnightMoves(piece, squares);
  }
    render() {
      const divStyle = {
        color: '#aaaaaa',
        fontSize: 85,
      };
      return (
        <div style={divStyle} className="piece">
          {String.fromCharCode(9816)}
        </div>
      );
    }
}
export default KnightB;
