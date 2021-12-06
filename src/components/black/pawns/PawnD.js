import React from 'react';

class PawnD extends React.Component {
  

  getCandidateMoves(piece, board, prevMove) {
    //console.log('Black Pawn D');
    return this.getCandidateBlackPawnMoves(piece, board, prevMove);
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

export default PawnD;
