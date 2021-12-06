import React from "react";

class PawnH extends React.Component {
  getCandidateMoves(piece, board, prevMove) {
    //console.log('White Pawn H');
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

export default PawnH;
