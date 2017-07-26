import React from 'react';
import CONSTANTS from '../config/constants';


class Moves extends React.Component {

  constructor(props) {
    super(props);
        this.state = {
        enPasse: 0 // candidate for en passe, check the opponent's previous pawn move if en passe is allowed!
    }
  }


    moveWhiteKing(piece, squares) {

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


    // en passe -> former position (former from move)
  movePawn(piece, squares) { //FIXME: -> moveWhitePawn

    let id = piece.n; // uniq piece id number, non-changing
    let pos = piece.location;

    let FRONT = pos - 8;
    let FRONT2 = pos - 16;
    let LEFT_DOWN = pos - 9; // white eat
    let RIGHT_DOWN = pos - 7;
    let LEFT_UP = pos + 9; // black eat
    let RIGHT_UP = pos + 7;

    let LEFT = pos - 1;
    let RIGHT = pos + 1;
    // en passe previous moves
    let EN_PASSE_WHITE_LEFT = pos - 17;
    let EN_PASSE_WHITE_RIGHT = pos - 15;

    let acceptedMoves = [];

    // en passe -> former position

    if (id >= CONSTANTS.minWhite) { // white
        console.log('PIECE='+piece.location+piece.type+piece.id+piece.n);

        if (squares[FRONT].piece == null) {
            acceptedMoves.push(FRONT);
          if (pos >= CONSTANTS.minWhite && squares[FRONT2].piece == null) { // hasn't moved yet
              this.setState({enPasse: piece.location});
              acceptedMoves.push(FRONT2);
          }
        }
        if (squares[LEFT_DOWN].piece !== undefined && squares[LEFT_DOWN].piece.n <= CONSTANTS.maxBlack) { // right up eat black
            acceptedMoves.push(LEFT_DOWN); // eat black piece
        }
        if (squares[RIGHT_DOWN].piece !== undefined && squares[RIGHT_DOWN].piece.n <= CONSTANTS.maxBlack) { // right up eat black
            acceptedMoves.push(RIGHT_DOWN); // eat black piece
        }
        if (this.state.enPasse === EN_PASSE_WHITE_LEFT) {
          // FIXME: add condition for en passe (correct black pawn two up previous move)
          if (squares[LEFT].piece !== undefined && (squares[LEFT].piece.n >= CONSTANTS.minBlackPawn && squares[LEFT].piece.n <= CONSTANTS.maxBlack)) {
              acceptedMoves.push(LEFT_UP); // en passe black pawn
          }
        }

        if (this.state.enPasse === EN_PASSE_WHITE_RIGHT) {
          if (squares[RIGHT].piece !== undefined && (squares[RIGHT].piece.n >= CONSTANTS.minBlackPawn && squares[RIGHT].piece.n <= CONSTANTS.maxBlack)) {
              acceptedMoves.push(RIGHT_UP); // en passe black pawn
          }
        }
    } else {

    }
    return acceptedMoves;
  }
}

export default Moves;
