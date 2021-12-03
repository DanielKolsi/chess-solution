import React from 'react';

class Rook3 extends React.Component {
  
  
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
export default Rook3;
