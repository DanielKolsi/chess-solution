import React from 'react';
import Moves from '../../Moves';

class PawnB extends Moves {
  constructor(props) {
    super(props);
    this.state = {      
    }
  }

    getCandidateMoves(piece, squares, prevMove) {
      //console.log('\n**White Pawn B**\n');
      return this.getCandidateWhitePawnMoves(piece, squares, prevMove);
    }

//{String.fromCharCode(9817)}
    render() {
      return (
        <div className="piece">
          {'b'}
        </div>
      );
    }
}

export default PawnB;
