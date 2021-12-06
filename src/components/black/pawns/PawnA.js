import React from "react";

class PawnA extends React.Component {
  /**
   * 
   * @param {*} piece 
   * @param {*} board 
   * @param {*} prevMove 
   * @returns 
   */
  getCandidateMoves(piece, board, prevMove) {
    //console.log('Black Pawn A');
    return this.getCandidateBlackPawnMoves(piece, board, prevMove);
  }
  render() {
    const divStyle = {
      fontSize: 80,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9823)}
      </div>
    );
  }
}

export default PawnA;
