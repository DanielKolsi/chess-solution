import React from 'react';

class RookH extends React.Component {
  

  /**
   * 
   * @param {*} piece 
   * @param {*} board 
   * @returns 
   */
  getCandidateMoves(piece, board) {
    //console.log('Black Rook H');
    return this.getCandidateRookMoves(piece, board);
  }

    render() {
      const divStyle = {
        fontSize: 85,
      };
      return (
        <div style={divStyle} className="piece">
          {String.fromCharCode(9820)}
        </div>
      );
    }
}
export default RookH;
