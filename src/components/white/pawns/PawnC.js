import React from 'react';


class PawnC extends React.Component {

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('White Pawn C');
    return this.getCandidateWhitePawnMoves(piece, squares, prevMove);
  }

  render() {
    const divStyle = {
      color: '#aaaaaa',
      fontSize: 80,
    };        
    
    return (
      <div style={divStyle} className="piece">          
        {String.fromCharCode(9817)}
      </div>
    );
  }

}

export default PawnC;
