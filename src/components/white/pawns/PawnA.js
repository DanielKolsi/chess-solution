import React from "react";

class PawnA extends React.Component {
  /**
   *
   * @param {*} piece
   * @param {*} board
   * @param {*} prevMove
   * @returns
   */
  getCandidateMoves(piece, board, prevMove) {
    //console.log('\n**White Pawn A**\n');
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

export default PawnA;
