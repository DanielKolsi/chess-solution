import React from 'react';
import CONSTANTS from '../../../config/constants';

class King extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  // ensure that source position contains two digits
  getFormattedPosition(pos) {

    if (pos < CONSTANTS.minTwoDigitNumber) {
      pos = '0' + pos; //use format 01, 02 ... 09 for source
    }
    return pos;
  }

  getAcceptedMoves(piece, squares) {

    let acceptedMoves = [];
    let pos = piece.location;
    let src = this.getFormattedPosition(pos);

    let up = pos + CONSTANTS.up;
    let down = pos + CONSTANTS.down;
    let left = pos + CONSTANTS.left;
    let right = pos + CONSTANTS.right;
    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;
    let upLeft = pos + CONSTANTS.upLeft;
    let upRight = pos + CONSTANTS.upRight;

      // check condition, remove threads from previous black move (possibleBlackMoves, candidateMove, removelMoves)

      if (squares[pos].row < CONSTANTS.maxRow) { // needs to stay on the board limits
        if (squares[up].piece == null || squares[up].piece.white === false) {
            acceptedMoves.push(src + '' + up);
        }
      }

      if (squares[pos].row > CONSTANTS.minRow) { // needs to stay on the board limits
        if (squares[down].piece == null || squares[down].piece.white === false) {
            acceptedMoves.push(src + '' + down);
        }
      }

      if (squares[pos].col > CONSTANTS.minCol) { // needs to stay on the board limits
        if (squares[left].piece == null || squares[left].piece.white === false) {
            acceptedMoves.push(src + '' + left);
        }
      }

      if (squares[pos].col < CONSTANTS.maxCol) { // needs to stay on the board limits
        if (squares[right].piece == null || squares[right].piece.white === false) {
            acceptedMoves.push(src + '' + pos + '' + right);
        }
      }

      if (squares[pos].row < CONSTANTS.minRow && (squares[pos].col < CONSTANTS.minCol)) { // needs to stay on the board limits
        if (squares[upRight].piece == null || squares[upRight].piece.white === false) {
          acceptedMoves.push(src + '' + pos + '' + upRight);
        }
      }

      if (squares[pos].row > CONSTANTS.minRow && squares[pos].col < CONSTANTS.maxCol) { // needs to stay on the board limits
        if (squares[downRight].piece == null || squares[downRight].piece.white === false) {
            acceptedMoves.push(src + '' + downRight);
        }
      }

      if (squares[pos].row < CONSTANTS.maxRow && squares[pos].col > CONSTANTS.minCol) { // needs to stay on the board limits
        if (squares[upLeft].piece == null || squares[upLeft].piece.white === false) {
            acceptedMoves.push(src + '' + upLeft);
        }
      }

      if (squares[pos].row > CONSTANTS.minRow && squares[pos].col > CONSTANTS.minCol) { // needs to stay on the board limits
        if (squares[downLeft].piece == null || squares[downLeft].piece.white === false) {
            acceptedMoves.push(src + '' + downLeft);
        }
     }
     console.log('White king moves size = ' + acceptedMoves.length);
     return acceptedMoves;
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9812)}
        </div>
      );
    }
}
export default King;
