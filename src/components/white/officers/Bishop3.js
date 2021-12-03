import React from 'react';

class Bishop3 extends React.Component {
  

  getCandidateMoves(piece, squares) {
    
    return this.getCandidateBishopMoves(piece, squares);
  }

    render() {
      const divStyle = {
        color: '#aaaaaa',
        fontSize: 85,
      };
      return (
        <div style={divStyle} className="piece">
          {String.fromCharCode(9815)}
        </div>
      );
    }
}
export default Bishop3;
