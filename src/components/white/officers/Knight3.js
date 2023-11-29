import React from "react";

class Knight3 extends React.Component {
  /**
   *
   * @param {*} piece
   * @param {*} board
   * @returns
   */
  getCandidateMoves(piece, board) {
    //console.log('White Knight B');
    return this.getCandidateKnightMoves(piece, board);
  }
  render() {
    const divStyle = {
      color: "#aaaaaa",
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9816)}
      </div>
    );
  }
}
export default Knight3;
