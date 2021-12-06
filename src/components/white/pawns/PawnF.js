import React from "react";

class PawnF extends React.Component {
  getCandidateMoves(piece, board, prevMove) {
    //console.log('White Pawn F');
    return this.getCandidateWhitePawnMoves(piece, board, prevMove);
  }
  render() {
    const divStyle = {
      color: "#aaaaaa",
      fontSize: 80,
    };

    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9817)}
      </div>
    );
  }
}

export default PawnF;
