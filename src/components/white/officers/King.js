import React from 'react';
import CONSTANTS from '../../../config/constants';

class King extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getAcceptedMoves(piece, squares) {

    let acceptedMoves = [];
    let pos = piece.location;

    let up = pos + CONSTANTS.up;
    let down = pos + CONSTANTS.down;
    let left = pos + CONSTANTS.left;
    let right = pos + CONSTANTS.right;
    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;
    let upLeft = pos + CONSTANTS.upLeft;
    let upRight = pos + CONSTANTS.upRight;

      // check condition, remove threads from previous black move (possibleBlackMoves, candidateMove, removelMoves)

      if (squares[pos].row < 7) { // needs to stay on the board limits
        if (squares[up].piece == null || squares[up].piece.white === false) {
            acceptedMoves.push(up);
        }
      }

      if (squares[pos].row  > 0) { // needs to stay on the board limits
        if (squares[down].piece == null || squares[down].piece.white === false) {
            acceptedMoves.push(down);
        }
      }

      if (squares[pos].col  > 0) { // needs to stay on the board limits
        if (squares[left].piece == null || squares[left].piece.white === false) {
            acceptedMoves.push(left);
        }
      }

      if (squares[pos].col  < 7) { // needs to stay on the board limits
        if (squares[right].piece == null || squares[right].piece.white === false) {
            acceptedMoves.push(right);
        }
      }

      if (squares[pos].row < 7 && squares[pos].col  < 7) { // needs to stay on the board limits
        if (squares[upRight].piece == null || squares[upRight].piece.white === false) {
          acceptedMoves.push(upRight);
        }
      }

      if (squares[pos].row > 0 && squares[pos].col  < 7) { // needs to stay on the board limits
        if (squares[downRight].piece == null || squares[downRight].piece.white === false) {
            acceptedMoves.push(downRight);
        }
      }

      if (squares[pos].row < 7 && squares[pos].col  > 0) { // needs to stay on the board limits
        if (squares[upLeft].piece == null || squares[upLeft].piece.white === false) {
            acceptedMoves.push(upLeft);
        }
      }

      if (squares[pos].row > 0 && squares[pos].col  > 0) { // needs to stay on the board limits
        if (squares[downLeft].piece == null || squares[downLeft].piece.white === false) {
            acceptedMoves.push(downLeft);
        }
     }

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
