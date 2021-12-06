import React from "react";

class RookH extends React.Component {
  /**
   * 
   * @param {*} piece 
   * @param {*} squares 
   * @returns 
   */
  getCandidateMoves(piece, squares) {
    //console.log('White Rook H');
    return this.getCandidateRookMoves(piece, squares);
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
export default RookH;
