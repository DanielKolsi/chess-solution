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

    let UP = pos + 8;
    let DOWN = pos - 8;
    let LEFT = pos - 1;
    let RIGHT = pos + 1;
    let LEFT_DOWN = pos - 9;
    let RIGHT_DOWN = pos - 7;
    let LEFT_UP = pos + 9;
    let RIGHT_UP = pos + 7;

      // check condition, remove threads from previous black move (possibleBlackMoves, candidateMove, removelMoves)
      if (squares[UP].piece == null || squares[UP].piece.n <= CONSTANTS.maxBlack) {
          acceptedMoves.push(UP);
      }
      if (squares[DOWN].piece == null || squares[DOWN].piece.n <= CONSTANTS.maxBlack) {
          acceptedMoves.push(DOWN);
      }
      if (squares[LEFT].piece == null || squares[LEFT].piece.n <= CONSTANTS.maxBlack) {
          acceptedMoves.push(LEFT);
      }
      if (squares[RIGHT].piece == null || squares[RIGHT].piece.n <= CONSTANTS.maxBlack) {
          acceptedMoves.push(RIGHT);
      }
      if (squares[RIGHT_UP].piece == null || squares[RIGHT_UP].piece.n <= CONSTANTS.maxBlack) {
        acceptedMoves.push(RIGHT_UP);
      }
      if (squares[RIGHT_DOWN].piece == null || squares[RIGHT_DOWN].piece.n <= CONSTANTS.maxBlack) {
          acceptedMoves.push(RIGHT_DOWN);
      }
      if (squares[LEFT_UP].piece == null || squares[LEFT_UP].piece.n <= CONSTANTS.maxBlack) {
          acceptedMoves.push(LEFT_UP);
      }
      if (squares[LEFT_DOWN].piece == null || squares[LEFT_DOWN].piece.n <= CONSTANTS.maxBlack) {
          acceptedMoves.push(LEFT_DOWN);
      }
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
