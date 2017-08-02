import React from 'react';
import CONSTANTS from '../config/constants';

class Moves extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      enPasse: 0 // candidate for en passe, check the opponent's previous pawn move if en passe is allowed!
    }
  }

  // en passe -> former position (former from move)
  getWhitePawnMoves(piece, squares) {

    let pos = piece.location;

    // en passe previous moves
    let EN_PASSE_WHITE_LEFT = pos - 17;
    let EN_PASSE_WHITE_RIGHT = pos - 15;

    let down = pos + CONSTANTS.down;
    let down2 = pos + CONSTANTS.down2;
    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;

    let acceptedMoves = [];

    // en passe -> former position

      if (squares[down].piece == null) {
        acceptedMoves.push(down);

        if (squares[piece.location].row === CONSTANTS.blackPawnInitialRow && squares[down2].piece == null) { // hasn't moved yet, double pawn front
          //this.setState({enPasse: piece.location});
          acceptedMoves.push(down2);
        }
      }
      if (squares[downLeft].piece !== null && squares[downLeft].piece.white === false) { // eat black
        acceptedMoves.push(downLeft); // eat black piece
      }
      if (squares[downRight].piece !== null && squares[downRight].piece.white === false) { // right up eat black
        acceptedMoves.push(downRight); // eat black piece
      }
      if (this.state.enPasse === EN_PASSE_WHITE_LEFT) {
        // FIXME: add condition for en passe (correct black pawn two up previous move)
        if (squares[CONSTANTS.left].piece !== null && (squares[CONSTANTS.left].piece.value === CONSTANTS.whitePawnValue)) {
          acceptedMoves.push(downLeft); // en passe black pawn
        }
      }

      if (this.state.enPasse === EN_PASSE_WHITE_RIGHT) {
        //FIXME: replace with squares[RIGHT].piece.white == false
        if (squares[CONSTANTS.right].piece !== null && (squares[CONSTANTS.right].piece.value === CONSTANTS.whitePawnValue)) {
          acceptedMoves.push(downRight); // en passe black pawn
        }
      }
    return acceptedMoves;
  }

  getBlackPawnMoves(piece, squares) {

    let pos = piece.location;

    // en passe previous moves
    let EN_PASSE_WHITE_LEFT = pos - 17;
    let EN_PASSE_WHITE_RIGHT = pos - 15;

    let down = pos + CONSTANTS.down;
    let down2 = pos + CONSTANTS.down2;
    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;

    let acceptedMoves = [];

    // en passe -> former position

      if (squares[down].piece == null) {
        acceptedMoves.push(down);

        if (squares[piece.location].row === CONSTANTS.blackPawnInitialRow && squares[down2].piece == null) { // hasn't moved yet, double pawn front
          //this.setState({enPasse: piece.location});
          acceptedMoves.push(down2);
        }
      }
      if (squares[downLeft].piece !== null && squares[downLeft].piece.white === false) { // eat black
        acceptedMoves.push(downLeft); // eat black piece
      }
      if (squares[downRight].piece !== null && squares[downRight].piece.white === false) { // right up eat black
        acceptedMoves.push(downRight); // eat black piece
      }
      if (this.state.enPasse === EN_PASSE_WHITE_LEFT) {
        // FIXME: add condition for en passe (correct black pawn two up previous move)
        if (squares[CONSTANTS.left].piece !== null && (squares[CONSTANTS.left].piece.value === CONSTANTS.whitePawnValue)) {
          acceptedMoves.push(downLeft); // en passe black pawn
        }
      }

      if (this.state.enPasse === EN_PASSE_WHITE_RIGHT) {
        //FIXME: replace with squares[RIGHT].piece.white == false
        if (squares[CONSTANTS.right].piece !== null && (squares[CONSTANTS.right].piece.value === CONSTANTS.whitePawnValue)) {
          acceptedMoves.push(downRight); // en passe black pawn
        }
      }
    return acceptedMoves;
  }

  getKnightMoves(piece, squares) {

    let pos = piece.location;
    let acceptedMoves = [];

    // 2 right, 1 up
    let rightUp = pos + CONSTANTS.twoRightOneUp;

    if (squares[pos].row <= 6 && squares[pos].col <= 5) { // check that the move stays on the board
      if (squares[rightUp].piece == null || (squares[rightUp].piece.white !== squares[pos].piece.white)) {
        acceptedMoves.push(rightUp);
      }
    }
    // 2 right, 1 down
    let rightDown = pos + CONSTANTS.twoRightOneDown;

    if (squares[pos].row >= 1 && squares[pos].col <= 5) { // check that the move stays on the board
      if (squares[rightDown].piece == null || (squares[rightUp].piece.white !== squares[pos].piece.white)) {
        acceptedMoves.push(rightDown);
      }
    }

    // 2 up, 1 right
    let upRight = pos + CONSTANTS.twoUpOneRight;
    if (squares[pos].row <= 5 && squares[pos].col <= 6) {
      if (squares[upRight].piece == null || (squares[rightUp].piece.white !== squares[pos].piece.white)) {
        acceptedMoves.push(upRight);
      }
    }
    // 2 up, 1 left
    let upLeft = pos + 15;
    if (squares[pos].row <= 5 && squares[pos].col >= 1) {
      if (squares[upLeft].piece == null || (squares[rightUp].piece.white !== squares[pos].piece.white)) {
        acceptedMoves.push(upLeft);
      }
    }
    // 2 left, 1 up
    let leftUp = pos + CONSTANTS.twoLeftOneUp;

    if (squares[pos].row <= 6 && squares[pos].col >= 2) {
      if (squares[leftUp].piece == null || (squares[rightUp].piece.white !== squares[pos].piece.white)) {
        acceptedMoves.push(leftUp);
      }
    }

    // 2 left, 1 down
    let leftDown = pos + CONSTANTS.twoLeftOneDown;
    if (squares[pos].row >= 1 && squares[pos].col >= 2) {
      if (squares[leftDown].piece == null || (squares[rightUp].piece.white !== squares[pos].piece.white)) {
        acceptedMoves.push(leftDown);
      }
    }
    // 2 down, 1 right
    let downRight = pos + CONSTANTS.twoDownOneRight;
    if (squares[pos].row >= 2 && squares[pos].col <= 6) {
      if (squares[downRight].piece == null || (squares[rightUp].piece.white !== squares[pos].piece.white)) {
        acceptedMoves.push(downRight);
      }
    }
    // 2 down, 1 left
    let downLeft = pos + CONSTANTS.twoDownOneLeft;
    if (squares[pos].row >= 2 && squares[pos].col >= 1) {
      if (squares[downLeft].piece == null || (squares[rightUp].piece.white !== squares[pos].piece.white)) {
        acceptedMoves.push(downLeft);
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
        acceptedMoves.push(pos - (i * CONSTANTS.upRight));
      } else if (squares[dst].white !== squares[pos].white) {
        acceptedMoves.push(dst);// eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    console.log('up right moves ='+acceptedMoves.length);
    return acceptedMoves;
  }

  getDiagonalMovesUpLeft(piece, squares, acceptedMoves) {

    let pos = piece.location;
    let squaresAvailableLeft = squares[pos].col;

    const squaresAvailableUp = CONSTANTS.maxRow - squares[pos].row;

    let numberOfSquaresAvailable;

    if (squaresAvailableLeft <= squaresAvailableUp) {
      numberOfSquaresAvailable = squaresAvailableLeft;
    } else {
      numberOfSquaresAvailable = squaresAvailableUp;
    }

    console.log('up left moves BEFORE ='+acceptedMoves.length);
    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + (i * CONSTANTS.upLeft);
      if (squares[dst].piece == null) {
        acceptedMoves.push(dst);
      } else if (squares[dst].white !== squares[pos].white) {
        acceptedMoves.push(dst);// eat opponent's piece
        break;
      } else {
        console.log('own piece!');
        break; // own piece
      }
    }
    console.log('up left moves ='+acceptedMoves.length);
    return acceptedMoves;
  }

  getDiagonalMovesDownRight(piece, squares, acceptedMoves) {

    let pos = piece.location;
    let squaresAvailableRight = CONSTANTS.maxCol - squares[pos].col;
    let squaresAvailableDown = squares[pos].row;

    let numberOfSquaresAvailable;

    if (squaresAvailableRight <= squaresAvailableDown) {
      numberOfSquaresAvailable = squaresAvailableRight;
    } else {
      numberOfSquaresAvailable = squaresAvailableDown;
    }

    console.log('sqr available ='+ numberOfSquaresAvailable);

    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + (i * CONSTANTS.downRight);
      if (squares[dst].piece == null) {

        acceptedMoves.push(dst);
      } else if (squares[dst].white !== squares[pos].white) {
        acceptedMoves.push(dst);// eat opponent's piece
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
    let squaresAvailableLeft = squares[pos].col;
    let squaresAvailableDown = squares[pos].row;

    let numberOfSquaresAvailable;

    if (squaresAvailableLeft <= squaresAvailableDown) {
      numberOfSquaresAvailable = squaresAvailableLeft;
    } else {
      numberOfSquaresAvailable = squaresAvailableDown;
    }

    console.log('squares available ='+numberOfSquaresAvailable);
    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + (i * CONSTANTS.downLeft);
      if (squares[dst].piece == null) {
        acceptedMoves.push(dst);
      } else if (squares[dst].white !== squares[pos].white) {
        acceptedMoves.push(dst);// eat opponent's piece
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

    let acceptedMoves = [];
    let UP = pos + CONSTANTS.up;
    let DOWN = pos + CONSTANTS.down;
    let LEFT = pos + CONSTANTS.left;
    let RIGHT = pos + CONSTANTS.right;


    // move UP
    for (let i = UP; i < squares.length; i += CONSTANTS.up) {
      if (squares[i].piece === null) {
        acceptedMoves.push(i);
      } else if (squares[pos].white !== squares[i].white) { // eat
        acceptedMoves.push(i);
        break; // no more move possibilities after eating
      } else break; // own piece blocks
    }
    // move DOWN
    for (let i = DOWN; i >= 0; i += CONSTANTS.down) {

      if (squares[i].piece === null) {
        acceptedMoves.push(i);
      } else if (squares[pos].white !== squares[i].white) {
        acceptedMoves.push(i);
        break; // no more move possibilities after eating
      } else break; // own piece
    }

    // move RIGHT
    let movesRight = CONSTANTS.maxCol - squares[pos].col;

    for (let i = RIGHT; i <= (movesRight + pos); i++) {
      if (squares[i].piece === null) {
        acceptedMoves.push(i);
      } else if (squares[pos].white !== squares[i].white) {
        acceptedMoves.push(i);
        break; // no more move possibilities after eating
      } else break; // own piece
    }

    // move LEFT
    let movesLeft = squares[pos].col;

    for (let i = LEFT; i >= (pos - movesLeft); i--) {

      if (squares[i].piece === null) {
        acceptedMoves.push(i);
      } else if (squares[pos].white !== squares[i].white) {
        acceptedMoves.push(i);
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
