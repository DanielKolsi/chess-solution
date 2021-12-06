import React from "react";

class Queen3 extends React.Component {
  /**
   * 
   * @param {*} piece 
   * @param {*} board 
   * @returns 
   */
  getCandidateMoves(piece, board) {
    console.log("Black Queen3");    
    return this.getCandidateQueenMoves(piece, board);
  }

  render() {
    const divStyle = {
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9813)}
      </div>
    );
  }
}
export default Queen3;
