import React from "react";

class KnightB extends React.Component {
  getCandidateMoves(piece, board) {
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
export default KnightB;
