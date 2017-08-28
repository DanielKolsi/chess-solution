import React from 'react';
import CONSTANTS from '../../../config/constants';

class King extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  getCandidateMoves(piece, squares) {

    let candidateMoves = [];
    let pos = 1 * piece.location;

    let up = pos + CONSTANTS.up;
    let down = pos + CONSTANTS.down;
    let left = pos + CONSTANTS.left;
    let right = pos + CONSTANTS.right;
    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;
    let upLeft = pos + CONSTANTS.upLeft;
    let upRight = pos + CONSTANTS.upRight;


    if (squares[pos].row < CONSTANTS.maxRow) { // needs to stay on the board limits
      if (squares[up].piece === null || (squares[up].piece.white === true)) {
        candidateMoves.push(pos + '#' + up);
      }
    }

    if (squares[pos].row > CONSTANTS.minRow) { // needs to stay on the board limits
      if (squares[down].piece === null || (squares[down].piece.white === true)) {
        candidateMoves.push(pos + '#' + down);
      }
    }

    if (squares[pos].col > CONSTANTS.minCol) { // needs to stay on the board limits
      if (squares[left].piece === null || (squares[left].piece.white === true)) {
        candidateMoves.push(pos + '#' + left);
      }
    }

    if (squares[pos].col < CONSTANTS.maxCol) { // needs to stay on the board limits
      if (squares[right].piece === null || (squares[right].piece.white === true)) {
        candidateMoves.push(pos + '#' + right);
      }
    }

    if (squares[pos].row < CONSTANTS.maxRow && (squares[pos].col < CONSTANTS.maxCol)) { // needs to stay on the board limits
      if (squares[upRight].piece === null || (squares[upRight].piece.white === true)) {
        candidateMoves.push(pos + '#' + upRight);
      }
    }

    if (squares[pos].row > CONSTANTS.minRow && squares[pos].col < CONSTANTS.maxCol) { // needs to stay on the board limits
      if (squares[downRight].piece === null || (squares[downRight].piece.white === true)) {
        candidateMoves.push(pos + '#' + downRight);
      }
    }

    if (squares[pos].row < CONSTANTS.maxRow && squares[pos].col > CONSTANTS.minCol) { // needs to stay on the board limits
      if (squares[upLeft].piece === null || (squares[upLeft].piece.white === true)) {
        candidateMoves.push(pos + '#' + upLeft);
      }
    }

    if (squares[pos].row > CONSTANTS.minRow && squares[pos].col > CONSTANTS.minCol) { // needs to stay on the board limits
      if (squares[downLeft].piece === null || (squares[downLeft].piece.white === true)) {
        candidateMoves.push(pos + '#' + downLeft);
      }
    }
    //console.log('Black king moves size = ' + candidateMoves.length);
    return candidateMoves;
  }

  render() {
    return (
      <div className="piece">
        {String.fromCharCode(9818)}
      </div>
    );
  }
}
export default King;
