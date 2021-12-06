import React from "react";

class RookA extends React.Component {
  /**
   * 
   * @param {*} piece 
   * @param {*} board 
   * @returns 
   */
  getCandidateMoves(piece, board) {
    return this.getCandidateRookMoves(piece, board);
  }

  render() {
    const divStyle = {
      color: "#aaaaaa",
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9814)}
      </div>
    );
  }
}
export default RookA;
