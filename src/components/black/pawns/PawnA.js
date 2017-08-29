import React from 'react';
import Moves from '../../Moves';

class PawnA extends Moves {
  constructor(props) {
    super(props);
    //console.log('props PawnA = ' + props.type);
    this.state = {
    }
  }

  getCandidateMoves(piece, squares, prevMove) {
    //console.log('Black Pawn A');
    return this.getCandidateBlackPawnMoves(piece, squares, prevMove);
  }
    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9823)}
        </div>
      );
    }
}

export default PawnA;
