import React from 'react';
import Moves from '../../Moves';

class PawnC extends Moves {
  constructor(props) {
    super(props);
    this.state = {
  
    }
  }

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
