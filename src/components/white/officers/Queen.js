import React from 'react';

class Queen extends React.Component {
  
  /**
   * 
   * @param {*} piece 
   * @param {*} board 
   * @returns 
   */
  getCandidateMoves(piece, board) {
    //console.log('White Queen');    
    return this.getCandidateQueenMoves(piece, board);
  }

  render() {
    const divStyle = {
      color: '#aaaaaa',
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9813)}
      </div>
    );
  }
}
export default Queen;
