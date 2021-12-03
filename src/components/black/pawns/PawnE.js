import React from 'react';


class PawnE extends React.Component{
  

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('Black Pawn E');
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

export default PawnE;
