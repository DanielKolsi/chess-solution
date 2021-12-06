import React from "react";

class BishopC extends React.Component {
  /**
   * 
   * @param {*} piece 
   * @param {*} board 
   * @returns 
   */
  getCandidateMoves(piece, board) {
    //console.log('White Bishop C');
    return this.getCandidateBishopMoves(piece, board);
  }

  render() {
    const divStyle = {
      color: "#aaaaaa",
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9815)}
      </div>
    );
  }
}
export default BishopC;
