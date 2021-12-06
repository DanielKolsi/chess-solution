import React from "react";

class PawnB extends React.Component {
  getCandidateMoves(piece, board, prevMove) {
    //console.log('\n**White Pawn B**\n');
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

export default PawnB;
