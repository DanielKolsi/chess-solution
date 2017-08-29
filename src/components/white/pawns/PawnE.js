import React from 'react';
import Moves from '../../Moves';

class PawnE extends Moves {
  constructor(props) {
    super(props);
    this.state = {      
    }
  }

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('White Pawn E');
    return this.getCandidateWhitePawnMoves(piece, squares, prevMove);
  }


    render() {
      return (
        <div className="piece">
          {'e'}
        </div>
      );
    }
}

export default PawnE;
