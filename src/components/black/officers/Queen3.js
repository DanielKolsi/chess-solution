import React from 'react';


class Queen3 extends React.Component {
  

  getCandidateMoves(piece, squares) {
    console.log('Black Queen3');
    if (piece.value !== -9) return undefined;
    return this.getCandidateQueenMoves(piece, squares);
  }

  render() {
    
    const divStyle = {
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9813)}
      </div>
    );
  }
}
export default Queen3;
