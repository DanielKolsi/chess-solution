import React from 'react';
import CONSTANTS from '../config/constants';

class Moves extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      enPasse: 0 // candidate for en passe, check the opponent's previous pawn move if en passe is allowed!
    }
  }

  moveRook(piece, squares) {
    let id = piece.n; // uniq piece id number, non-changing
    let pos = piece.location;
    let UP = pos + 8;
    let DOWN = pos - 8;
    let acceptedMoves = [];
    let LEFT = pos - 1;
    let RIGHT = pos + 1;

    // move UP
    for (let i = UP; i < squares.length; i += UP) {
      if (squares[i].piece == null) {
        acceptedMoves.push(i);
      }
    }
    // move DOWN
    for (let i = DOWN; i > 0; i -= DOWN) {
      if (squares[i].piece == null) {
        acceptedMoves.push(i);
      }
    }

    // move RIGHT
    let movesRight = this.getColsToRight(pos);
    for (let i = RIGHT; i <= (movesRight + pos); i++) {
      if (squares[i].piece == null) {
        acceptedMoves.push(i);
      }
    }

    // move LEFT
    let movesLeft = this.getColsToLeft(pos);
    for (let i = LEFT; i >= movesLeft; i--) {
      if (squares[i].piece == null) {
        acceptedMoves.push(i);
      }
    }
  }

  moveKnightWhite(piece, squares) {

    let pos = piece.location;
    let acceptedMoves = [];

    // 2 right, 1 up
    let rightUp = pos + 10;
    if (squares[rightUp].piece == null || squares[rightUp].piece.n <= CONSTANTS.maxBlack) {
        acceptedMoves.push(rightUp);
    }

    // 2 right, 1 down
    let rightDown = pos + 10;
    if (squares[rightDown].piece == null || squares[rightDown].piece.n <= CONSTANTS.maxBlack) {
        acceptedMoves.push(rightDown);
    }

    // 2 up, 1 right
    let upRight = pos + 17;
    if (squares[upRight].piece == null || squares[upRight].piece.n <= CONSTANTS.maxBlack) {
        acceptedMoves.push(upRight);
    }

    // 2 up, 1 left
    let upLeft = pos + 15;
    if (squares[upLeft].piece == null || squares[upLeft].piece.n <= CONSTANTS.maxBlack) {
        acceptedMoves.push(upLeft);
    }

    // 2 left, 1 up
    let leftUp = pos + 15;
    if (squares[leftUp].piece == null || squares[leftUp].piece.n <= CONSTANTS.maxBlack) {
        acceptedMoves.push(leftUp);
    }

    // 2 left, 1 down
    let leftDown = pos + 6;
    if (squares[leftDown].piece == null || squares[leftDown].piece.n <= CONSTANTS.maxBlack) {
        acceptedMoves.push(leftDown);
    }

    // 2 down, 1 right
    let downRight = pos + 17;
    if (squares[downRight].piece == null || squares[downRight].piece.n <= CONSTANTS.maxBlack) {
        acceptedMoves.push(downRight);
    }
    // 2 down, 1 left
    let downLeft = pos + 15;
    if (squares[downLeft].piece == null || squares[downLeft].piece.n <= CONSTANTS.maxBlack) {
        acceptedMoves.push(downLeft);
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
      console.log('PIECE=' + piece.location + piece.type + piece.id + piece.n);

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
    } else {}
    return acceptedMoves;
  }

 // columns left for left direction based on current position
  getColsToLeft(pos) {

    const COLS_IN_ROW = 8;
    if (pos < COLS_IN_ROW) {
      return pos;
    }
    return pos % COLS_IN_ROW;
  }

// columns left for right direction based on current position
  getColsToRight(pos) {
    const COLS_IN_ROW = 8;
    const MAX_COL_NUMBER = COLS_IN_ROW - 1; // 0...7
    if (pos < COLS_IN_ROW) {
      return (MAX_COL_NUMBER - pos);
    }
    return (MAX_COL_NUMBER - (pos % COLS_IN_ROW));
  }

  getDiagonalMovesUpRight(pos) {

    const RIGHT = this.getColsToRight(pos);
    const UP = 8 - Math.floor(pos / 8);

    let numberOfMoves;
    let acceptedMoves = [];

    if (RIGHT <= UP) {
      numberOfMoves = RIGHT;
    } else {
      numberOfMoves = UP;
    }

    const upRightReduction = 7;
    for (let i = 1; i <= numberOfMoves; i++) {
      acceptedMoves.push(pos - (i * upRightReduction));
    }
  }

  getDiagonalMovesUpLeft(pos) {

    const LEFT = this.getColsToLeft(pos);
    const UP = 8 - Math.floor(pos / 8);

    let numberOfMoves;
    let acceptedMoves = [];

    if (LEFT <= UP) {
      numberOfMoves = LEFT;
    } else {
      numberOfMoves = UP;
    }

    const upLeftReduction = 9; //FIXME, to constants
    for (let i = 1; i <= numberOfMoves; i++) {
      acceptedMoves.push(pos - (i * upLeftReduction));
    }
  }

  getDiagonalMovesDownRight(pos) {

    const RIGHT = this.getColsToRight(pos);
    const DOWN = Math.floor(pos / 8);

    let numberOfMoves;
    let acceptedMoves = [];

    if (RIGHT <= DOWN) {
      numberOfMoves = RIGHT;
    } else {
      numberOfMoves = DOWN;
    }

    const downRightAddition = 9; //FIXME, to constants
    for (let i = 1; i <= numberOfMoves; i++) {
      acceptedMoves.push(pos + (i * downRightAddition));
    }
  }

  getDiagonalMovesDownLeft(pos) {

    const LEFT = this.getColsToLeft(pos);
    const DOWN = Math.floor(pos / 8);

    let numberOfMoves;
    let acceptedMoves = [];

    if (LEFT <= DOWN) {
      numberOfMoves = LEFT;
    } else {
      numberOfMoves = DOWN;
    }

    const downLeftAddition = 7; //FIXME, to constants
    for (let i = 1; i <= numberOfMoves; i++) {
      acceptedMoves.push(pos + (i * downLeftAddition));
    }
  }

}

export default Moves;
