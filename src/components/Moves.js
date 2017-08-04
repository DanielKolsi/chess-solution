import React from 'react';
import CONSTANTS from '../config/constants';

class Moves extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      enPasse: 0 // candidate for en passe, check the opponent's previous pawn move if en passe is allowed!
    }
  }

  // ensure that source position contains two digits
  getFormattedPosition(pos) {

    if (pos < CONSTANTS.minTwoDigitNumber) {
      pos = '0' + pos; //use format 01, 02 ... 09 for source
    }
    return pos;
  }

  // en passe -> former position (former from move)
  getWhitePawnMoves(piece, squares) {

    let pos = piece.location;
    let src = this.getFormattedPosition(pos);

    let down = pos + CONSTANTS.down;
    let down2 = pos + CONSTANTS.down2;
    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;

    let acceptedMoves = [];

    // en passe -> former position

      if (squares[down].piece === null && (squares[piece.location].row > CONSTANTS.minRow)) {
        acceptedMoves.push(src + '' + down);

        if (squares[piece.location].row === CONSTANTS.whitePawnInitialRow && squares[down2].piece == null) { // hasn't moved yet, double pawn front
          //this.setState({enPasse: piece.location});
          acceptedMoves.push(down2);
        }
      }
      if (squares[pos].col > CONSTANTS.minCol && (squares[downLeft].piece !== null && squares[downLeft].piece.white === false)) { // eat black
        acceptedMoves.push(src + '' + downLeft); // eat black piece
      }
      if (squares[pos].col < CONSTANTS.maxCol && (squares[downRight].piece !== null && squares[downRight].piece.white === false)) { // right up eat black
        acceptedMoves.push(downRight); // eat black piece
      }
      if (this.state.enPasse === (pos + CONSTANTS.enPasseDownLeft)) {
        // FIXME: add condition for en passe (correct black pawn two up previous move)
        if (squares[CONSTANTS.left].piece !== null && (squares[CONSTANTS.left].piece.value === CONSTANTS.whitePawnValue)) {
          acceptedMoves.push(src + '' + downLeft); // en passe black pawn
        }
      }

      if (this.state.enPasse === (pos + CONSTANTS.enPasseDownRight)) {
        //FIXME: replace with squares[RIGHT].piece.white == false
        if (squares[CONSTANTS.right].piece !== null && (squares[CONSTANTS.right].piece.value === CONSTANTS.whitePawnValue)) {
          acceptedMoves.push(src + '' + downRight); // en passe black pawn
        }
      }
    return acceptedMoves;
  }

  getBlackPawnMoves(piece, squares) {

    let pos = piece.location;
    let src = this.getFormattedPosition(pos);

    let up = pos + CONSTANTS.up;
    let up2 = pos + CONSTANTS.up2;
    let upLeft = pos + CONSTANTS.upLeft;
    let upRight = pos + CONSTANTS.upRight;

    let acceptedMoves = [];

    // en passe -> former position

      if (squares[up].piece == null && (squares[piece.location].row < CONSTANTS.maxRow)) {
        acceptedMoves.push(src + '' + up);

        if (squares[piece.location].row === CONSTANTS.blackPawnInitialRow && squares[up2].piece === null) { // hasn't moved yet, double pawn front
          //this.setState({enPasse: piece.location});
          acceptedMoves.push(src + '' + up2);
        }
      }
      if (squares[pos].col > CONSTANTS.minCol && (squares[upLeft].piece !== null && squares[upLeft].piece.white === false)) { // eat white
          acceptedMoves.push(src + '' + upLeft);
      }
      if (squares[pos].col < CONSTANTS.maxCol && (squares[upRight].piece !== null && squares[upRight].piece.white === false)) { // right up eat white
        acceptedMoves.push(src + '' + upRight);
      }
      if (this.state.enPasse === (pos + CONSTANTS.enPasseUpLeft)) {
        // FIXME: add condition for en passe (correct black pawn two up previous move)
        if (squares[CONSTANTS.left].piece !== null && (squares[CONSTANTS.left].piece.value === CONSTANTS.whitePawnValue)) {
          acceptedMoves.push(src + '' + upLeft); // en passe black pawn
        }
      }

      if (this.state.enPasse === (pos + CONSTANTS.enPasseUpRight)) {
        //FIXME: replace with squares[RIGHT].piece.white == false
        if (squares[CONSTANTS.right].piece !== null && (squares[CONSTANTS.right].piece.value === CONSTANTS.whitePawnValue)) {
          acceptedMoves.push(src + '' + upRight); // en passe black pawn
        }
      }
    return acceptedMoves;
  }

  getKnightMoves(piece, squares) {

    let pos = piece.location;
    let src = this.getFormattedPosition(piece.location);
    let acceptedMoves = [];

    // 2 right, 1 up
    let rightUp = pos + CONSTANTS.twoRightOneUp;

    if (squares[pos].row <= 6 && squares[pos].col <= 5) { // check that the move stays on the board
      if (squares[rightUp].piece == null || (squares[rightUp].piece.white !== piece.white)) {
        acceptedMoves.push(src + '' + rightUp);
      }
    }
    // 2 right, 1 down
    let rightDown = pos + CONSTANTS.twoRightOneDown;

    if (squares[pos].row >= 1 && squares[pos].col <= 5) { // check that the move stays on the board
      if (squares[rightDown].piece == null || (squares[rightDown].piece.white !== piece.white)) {
        acceptedMoves.push(src + '' + rightDown);
      }
    }

    // 2 up, 1 right
    let upRight = pos + CONSTANTS.twoUpOneRight;
    if (squares[pos].row <= 5 && squares[pos].col <= 6) {
      if (squares[upRight].piece == null || (squares[upRight].piece.white !== piece.white)) {
        acceptedMoves.push(src + '' + upRight);
      }
    }
    // 2 up, 1 left
    let upLeft = pos + 15;
    if (squares[pos].row <= 5 && squares[pos].col >= 1) {
      if (squares[upLeft].piece == null || (squares[upLeft].piece.white !== piece.white)) {
        acceptedMoves.push(src + '' + upLeft);
      }
    }
    // 2 left, 1 up
    let leftUp = pos + CONSTANTS.twoLeftOneUp;

    if (squares[pos].row <= 6 && squares[pos].col >= 2) {
      if (squares[leftUp].piece == null || (squares[leftUp].piece.white !== piece.white)) {
        acceptedMoves.push(src + '' + leftUp);
      }
    }

    // 2 left, 1 down
    let leftDown = pos + CONSTANTS.twoLeftOneDown;
    if (squares[pos].row >= 1 && squares[pos].col >= 2) {
      if (squares[leftDown].piece == null || (squares[leftDown].piece.white !== piece.white)) {
        acceptedMoves.push(src + '' + leftDown);
      }
    }
    // 2 down, 1 right
    let downRight = pos + CONSTANTS.twoDownOneRight;
    if (squares[pos].row >= 2 && squares[pos].col <= 6) {
      if (squares[downRight].piece == null || (squares[downRight].piece.white !== piece.white)) {
        acceptedMoves.push(src + '' + downRight);
      }
    }
    // 2 down, 1 left
    let downLeft = pos + CONSTANTS.twoDownOneLeft;
    if (squares[pos].row >= 2 && squares[pos].col >= 1) {
      if (squares[downLeft].piece == null || (squares[downLeft].piece.white !== piece.white)) {
        acceptedMoves.push(src + '' + downLeft);
      }
    }
    return acceptedMoves;
  }

  getBishopMoves(piece, squares) {

    let acceptedMoves = [];

    acceptedMoves = this.getDiagonalMovesUpRight(piece, squares, acceptedMoves);
    acceptedMoves = this.getDiagonalMovesUpLeft(piece, squares, acceptedMoves);
    acceptedMoves = this.getDiagonalMovesDownLeft(piece, squares, acceptedMoves);
    acceptedMoves = this.getDiagonalMovesDownRight(piece, squares, acceptedMoves);

    return acceptedMoves;
  }


  getDiagonalMovesUpRight(piece, squares, acceptedMoves) {

    let pos = piece.location;
    let src = this.getFormattedPosition(pos);
    let squaresAvailableRight = CONSTANTS.maxCol - squares[pos].col;
    let squaresAvailableUp = CONSTANTS.maxRow - squares[pos].row;

    let numberOfSquaresAvailable;


    if (squaresAvailableRight <= squaresAvailableUp) {
      numberOfSquaresAvailable = squaresAvailableRight;
    } else {
      numberOfSquaresAvailable = squaresAvailableUp;
    }


    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + (i * CONSTANTS.upRight);
      if (squares[dst].piece == null) {
        acceptedMoves.push(src + ' ' + pos - (i * CONSTANTS.upRight));
      } else if (squares[dst].piece.white !== piece.white) {
        acceptedMoves.push(src + '' + dst);// eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    console.log('up right moves =' + acceptedMoves.length);
    return acceptedMoves;
  }

  getDiagonalMovesUpLeft(piece, squares, acceptedMoves) {

    let pos = piece.location;
    let src = this.getFormattedPosition(pos);
    let squaresAvailableLeft = squares[pos].col;

    const squaresAvailableUp = CONSTANTS.maxRow - squares[pos].row;

    let numberOfSquaresAvailable;

    if (squaresAvailableLeft <= squaresAvailableUp) {
      numberOfSquaresAvailable = squaresAvailableLeft;
    } else {
      numberOfSquaresAvailable = squaresAvailableUp;
    }

    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + (i * CONSTANTS.upLeft);

      if (squares[dst].piece == null) {
        acceptedMoves.push(src + '' + dst);
      } else if (squares[dst].piece.white !== piece.white) {
        acceptedMoves.push(src + '' + dst); // eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    console.log('up left moves ='+acceptedMoves.length);
    return acceptedMoves;
  }

  getDiagonalMovesDownRight(piece, squares, acceptedMoves) {

    let pos = piece.location;
    let src = this.getFormattedPosition(pos);

    let squaresAvailableRight = CONSTANTS.maxCol - squares[pos].col;
    let squaresAvailableDown = squares[pos].row;

    let numberOfSquaresAvailable;

    if (squaresAvailableRight <= squaresAvailableDown) {
      numberOfSquaresAvailable = squaresAvailableRight;
    } else {
      numberOfSquaresAvailable = squaresAvailableDown;
    }

    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + (i * CONSTANTS.downRight);
      if (squares[dst].piece == null) {

        acceptedMoves.push(src + '' + dst);
      } else if (squares[dst].piece.white !== piece.white) {
        acceptedMoves.push(src + '' + dst);// eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    console.log('down right moves ='+ acceptedMoves.length);
    return acceptedMoves;
  }


  getDiagonalMovesDownLeft(piece, squares, acceptedMoves) {

    //FIXME, BUG in move counting
    let pos = piece.location;
    let src = this.getFormattedPosition(pos);
    let squaresAvailableLeft = squares[pos].col;
    let squaresAvailableDown = squares[pos].row;

    let numberOfSquaresAvailable;

    if (squaresAvailableLeft <= squaresAvailableDown) {
      numberOfSquaresAvailable = squaresAvailableLeft;
    } else {
      numberOfSquaresAvailable = squaresAvailableDown;
    }



    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + (i * CONSTANTS.downLeft);
      if (squares[dst].piece == null) {
        acceptedMoves.push(src + '' + dst);
      } else if (squares[dst].piece.white !== piece.white) {
        acceptedMoves.push(src + '' + dst);// eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    console.log('down left moves ='+acceptedMoves.length);
    return acceptedMoves;
  }

  getRookMoves(piece, squares) {

    let pos = piece.location;
    let src = this.getFormattedPosition(piece.location);

    let acceptedMoves = [];
    let UP = pos + CONSTANTS.up;
    let DOWN = pos + CONSTANTS.down;
    let LEFT = pos + CONSTANTS.left;
    let RIGHT = pos + CONSTANTS.right;


    // move UP
    for (let i = UP; i < squares.length; i += CONSTANTS.up) {
      if (squares[i].piece === null) {
        acceptedMoves.push(src + '' + i);
      } else if (piece.white !== squares[i].piece.white) { // eat
        acceptedMoves.push(src + '' + i);
        break; // no more move possibilities after eating
      } else {
        break; // own piece blocks
      }
    }
    // move DOWN
    for (let i = DOWN; i >= 0; i += CONSTANTS.down) {

      if (squares[i].piece === null) {
        acceptedMoves.push(src + '' + i);
      } else if (piece.white !== squares[i].piece.white) { // eat
        acceptedMoves.push(src + '' + i);
        break; // no more move possibilities after eating
      } else break; // own piece
    }

    // move RIGHT
    let movesRight = CONSTANTS.maxCol - squares[pos].col;

    for (let i = RIGHT; i <= (movesRight + pos); i++) {
      if (squares[i].piece === null) {
        acceptedMoves.push(src + '' + i);
      } else if (piece.white !== squares[i].piece.white) { // eat
        acceptedMoves.push(src + '' + i);
        break; // no more move possibilities after eating
      } else break; // own piece
    }

    // move LEFT
    let movesLeft = squares[pos].col;

    for (let i = LEFT; i >= (pos - movesLeft); i--) {

      if (squares[i].piece === null) {
        acceptedMoves.push(src + '' + i);
      } else if (piece.white !== squares[i].piece.white) { // eat
        acceptedMoves.push(src + '' + i);
        break; // no more move possibilities after eating
      } else break; // own piece
    }
    return acceptedMoves;
  }

  getQueenMoves(piece, squares) {
    let acceptedMovesBishop = this.getBishopMoves(piece, squares);
    console.log('queen: bishop moves =' + acceptedMovesBishop.length);
    let acceptedMovesRook = this.getRookMoves(piece, squares);
    console.log('queen: rook moves =' + acceptedMovesRook.length);
    let acceptedMovesQueen = acceptedMovesBishop.concat(acceptedMovesRook);
    return acceptedMovesQueen;

  }
}

export default Moves;
