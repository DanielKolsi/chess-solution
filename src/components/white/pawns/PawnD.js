import React from "react";

class PawnD extends React.Component {
  /**
   *
   * @param {*} piece
   * @param {*} board
   * @param {*} prevMove
   * @returns
   */
  getCandidateMoves(piece, board, prevMove) {
    //console.log('White Pawn D');
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

export default PawnD;
