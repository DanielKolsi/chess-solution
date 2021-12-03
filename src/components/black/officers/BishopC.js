import React from 'react';

class BishopC extends React.Component{
  
  getCandidateMoves(piece, squares) {
    //console.log('Black Bishop C');
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
export default BishopC;
