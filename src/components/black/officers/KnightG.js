import React from "react";

class KnightG extends React.Component {
  /**
   *
   * @param {*} piece
   * @param {*} board
   * @returns
   */
  getCandidateMoves(piece, board) {
    //console.log('Black Knight G');
    return this.getCandidateKnightMoves(piece, board);
  }

  render() {
    const divStyle = {
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9822)}
      </div>
    );
  }
}
export default KnightG;
