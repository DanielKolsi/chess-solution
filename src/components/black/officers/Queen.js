import React from "react";

class Queen extends React.Component {
  /**
   *
   * @param {*} piece
   * @param {*} board
   * @returns
   */
  getCandidateMoves(piece, board) {
    //console.log("Black Queen");
    return this.getCandidateQueenMoves(piece, board);
  }

  render() {
    const divStyle = {
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9819)}
      </div>
    );
  }
}
export default Queen;
