import React from 'react';
import Moves from '../../Moves';

class PawnG extends Moves {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('White Pawn G');
    return this.getCandidateWhitePawnMoves(piece, squares, prevMove);
  }

    render() {
      return (
        <div className="piece">
          {'g'}
        </div>
      );
    }
}

export default PawnG;
