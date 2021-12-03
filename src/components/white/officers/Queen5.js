import React from 'react';


class Queen5 extends React.Component {
  

  getCandidateMoves(piece, squares) {
    console.log('White Queen5');
    if (piece.value !== 9) return undefined;
    return this.getCandidateQueenMoves(piece, squares);
  }

  render() {
    const divStyle = {
      color: '#aaaaaa',
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9813)}
      </div>
    );
  }
}
export default Queen5;
