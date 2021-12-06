import React from "react";

class Queen4 extends React.Component {
  /**
   *
   * @param {*} piece
   * @param {*} board
   * @returns
   */
  getCandidateMoves(piece, board) {
    //console.log('White Queen4');
    return this.getCandidateQueenMoves(piece, board);
  }

  render() {
    const divStyle = {
      color: "#aaaaaa",
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9813)}
      </div>
    );
  }
}
export default Queen4;
