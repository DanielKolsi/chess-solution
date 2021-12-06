import React from "react";

class PawnC extends React.Component {
  /**
   *
   * @param {*} piece
   * @param {*} board
   * @param {*} prevMove
   * @returns
   */
  getCandidateMoves(piece, board, prevMove) {
    //console.log('White Pawn C');
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

export default PawnC;
