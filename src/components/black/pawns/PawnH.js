import React from 'react';


class PawnH extends React.Component{
  

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('Black Pawn H');
    return this.getCandidateBlackPawnMoves(piece, squares, prevMove);
  }


    render() {
      const divStyle = {
        fontSize: 80,
      };
      return (
        <div style={divStyle} className="piece">
          {String.fromCharCode(9823)}
        </div>
      );
    }
}

export default PawnH;
