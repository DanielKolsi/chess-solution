import React from 'react';

class KnightG extends React.Component {
  
  getCandidateMoves(piece, squares) {
    //console.log('White Knight G');
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
export default KnightG;
