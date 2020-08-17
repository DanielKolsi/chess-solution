import React from 'react';
import Moves from '../../Moves';

class PawnA extends Moves {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('\n**White Pawn A**\n');
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

export default PawnA;
