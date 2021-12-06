import React from "react";

class BishopF extends React.Component {
  getCandidateMoves(piece, board) {
    //console.log('Black Bishop F');
    return this.getCandidateBishopMoves(piece, board);
  }

  render() {
    const divStyle = {
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9821)}
      </div>
    );
  }
}
export default BishopF;
