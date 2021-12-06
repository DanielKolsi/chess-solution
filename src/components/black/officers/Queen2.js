import React from "react";


class Queen2 extends React.Component {
  getCandidateMoves(piece, board) {
    console.log("Black Queen2");    
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
export default Queen2;
