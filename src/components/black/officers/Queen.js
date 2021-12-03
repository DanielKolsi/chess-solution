import React from 'react';


class Queen extends React.Component {
  

  getCandidateMoves(piece, squares) {
    console.log('Black Queen');
    if (piece.value !== -9) {
      return undefined;
    }
    return this.getCandidateQueenMoves(piece, squares);
  }

    render() {
      const divStyle = {
        fontSize: 85,
      };
      return (
        <div style={divStyle} className="piece">
          {String.fromCharCode(9819)}
        </div>
      );
    }
}
export default Queen;
