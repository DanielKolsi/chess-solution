import React from 'react';


class BishopF extends React.Component  {
  
  getCandidateMoves(piece, squares) {
    //console.log('Black Bishop F');
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
export default BishopF;
