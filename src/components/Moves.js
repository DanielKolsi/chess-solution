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
  getCandidateWhitePawnMoves(piece, squares, prevMove) {

    let pos = 1 * piece.location;

    const down = pos + CONSTANTS.down;
    let down2 = pos + CONSTANTS.down2;
    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;

    let acceptedMoves = [];

    if (squares[down].piece === null && (squares[pos].row > CONSTANTS.minRow)) {
      acceptedMoves.push(pos + '#' + down);

      if (squares[pos].row === CONSTANTS.whitePawnInitialRow && squares[down2].piece == null) { // hasn't moved yet, double pawn front
        acceptedMoves.push(pos + '#' + down2);
      }
    }

    if (squares[pos].col > CONSTANTS.minCol && (squares[downLeft].piece !== null && squares[downLeft].piece.white === false)) { // eat black
      acceptedMoves.push(pos + '#' + downLeft); // eats black piece
    }
    if (squares[pos].col < CONSTANTS.maxCol && (squares[downRight].piece !== null && squares[downRight].piece.white === false)) { // right up eat black
      acceptedMoves.push(pos + '#' + downRight); // eats black piece
    }
    if (this.state.enPasse === (pos + CONSTANTS.enPasseDownLeft)) {
      // FIXME: add condition for en passe (correct black pawn two up previous move)
      if (squares[CONSTANTS.left].piece !== null && (squares[CONSTANTS.left].piece.value === CONSTANTS.whitePawnValue)) {
        acceptedMoves.push(pos + '#' + downLeft); // en passe black pawn
      }
    }

    if (piece.row === CONSTANTS.whiteEnPasseAllowedRow) {
        const rightPiece = squares[pos + CONSTANTS.right].piece;
        const leftPiece = squares[pos - CONSTANTS.left].piece;

        if (rightPiece !== null && rightPiece.value === CONSTANTS.blackPawn) {
          const dst = pos + CONSTANTS.right;
          const src = dst + CONSTANTS.down2;

          const tmp =  src + '#' + dst;

          if (this.state.prevMove === tmp) {
              const downRight = pos + CONSTANTS.upDown;
              acceptedMoves.push(pos + 'P' + downRight); // en passe black pawn; P for en passe
          }

        } else if (leftPiece !== null && leftPiece.value === CONSTANTS.blackPawn) {
          const dst = pos + CONSTANTS.left;
          const src = dst + CONSTANTS.down2;
          const tmp =  src + '#' + dst;

          if (this.state.prevMove === tmp) {
              const downLeft = pos + CONSTANTS.downLeft;
              acceptedMoves.push(pos + 'P' + downLeft); // en passe black pawn; P for en passe
          }
        }
    }
    return acceptedMoves;
  }

  getCandidateBlackPawnMoves(piece, squares, prevMove) {

    const pos = 1 * piece.location; // ensure this is a number

    let up = pos + CONSTANTS.up;
    let up2 = pos + CONSTANTS.up2;
    let upLeft = pos + CONSTANTS.upLeft;
    let upRight = pos + CONSTANTS.upRight;

    let acceptedMoves = [];

    // en passe -> former position

    if (squares[up].piece === null && (squares[pos].row < CONSTANTS.maxRow)) {
      acceptedMoves.push(pos + '#' + up);

      if (squares[pos].row === CONSTANTS.blackPawnInitialRow && squares[up2].piece === null) { // hasn't moved yet, double pawn front
        //this.setState({enPasse: pos});
        acceptedMoves.push(pos + '#' + up2);
      }
    }
    if (squares[pos].col > CONSTANTS.minCol && (squares[upLeft].piece !== null && squares[upLeft].piece.white === true)) { // eat white
      acceptedMoves.push(pos + '#' + upLeft);
    }
    if (squares[pos].col < CONSTANTS.maxCol && (squares[upRight].piece !== null && squares[upRight].piece.white === true)) { // right up eat white
      acceptedMoves.push(pos + '#' + upRight);
    }
    if (this.state.enPasse === (pos + CONSTANTS.enPasseUpLeft)) {
      // FIXME: add condition for en passe (correct black pawn two up previous move)
      if (squares[CONSTANTS.left].piece !== null && (squares[CONSTANTS.left].piece.value === CONSTANTS.whitePawnValue)) {
        acceptedMoves.push(pos + '#' + upLeft); // en passe black pawn
      }
    }

    if (piece.row === CONSTANTS.blackEnPasseAllowedRow) {
        const rightPiece = squares[pos + CONSTANTS.right].piece;
        const leftPiece = squares[pos - CONSTANTS.left].piece;

        if (rightPiece !== null && rightPiece.value === CONSTANTS.whitePawn) {
          const dst = pos + CONSTANTS.right;
          const src = dst + CONSTANTS.up2;
          const tmp =  src + '#' + dst;

          if (this.state.prevMove === tmp) {
              const upRight = pos + CONSTANTS.upRight;
              acceptedMoves.push(pos + 'P' + upRight); // en passe black pawn; P for en passe
          }

        } else if (leftPiece !== null && leftPiece.value === CONSTANTS.whitePawn) {
          const dst = pos + CONSTANTS.left;
          const src = dst + CONSTANTS.up2;
          const tmp =  src + '#' + dst;

          if (this.state.prevMove === tmp) {
              const upLeft = pos + CONSTANTS.upLeft;
              acceptedMoves.push(pos + 'P' + upLeft); // en passe black pawn; P for en passe
          }
        }
    }

    return acceptedMoves;
  }

  getCandidateKnightMoves(piece, squares) {

    const pos = 1 * piece.location;
    let acceptedMoves = [];

    // 2 right, 1 up
    const rightUp = pos + CONSTANTS.twoRightOneUp;


    if (squares[pos].row <= 6 && squares[pos].col <= 5) { // check that the move stays on the board
      if (squares[rightUp].piece == null || (squares[rightUp].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + rightUp);
      }
    }
    // 2 right, 1 down
    let rightDown = pos + CONSTANTS.twoRightOneDown;

    if (squares[pos].row >= 1 && squares[pos].col <= 5) { // check that the move stays on the board
      if (squares[rightDown].piece == null || (squares[rightDown].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + rightDown);
      }
    }

    // 2 up, 1 right
    let upRight = pos + CONSTANTS.twoUpOneRight;

    if (squares[pos].row <= 5 && squares[pos].col <= 6) {
      if (squares[upRight].piece == null || (squares[upRight].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + upRight);
      }
    }
    // 2 up, 1 left
    let upLeft = pos + 15;

    if (squares[pos].row <= 5 && squares[pos].col >= 1) {
      if (squares[upLeft].piece == null || (squares[upLeft].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + upLeft);
      }
    }
    // 2 left, 1 up
    let leftUp = pos + CONSTANTS.twoLeftOneUp;



    if (squares[pos].row <= 6 && squares[pos].col >= 2) {
      if (squares[leftUp].piece == null || (squares[leftUp].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + leftUp);
      }
    }

    // 2 left, 1 down
    let leftDown = pos + CONSTANTS.twoLeftOneDown;


    if (squares[pos].row >= 1 && squares[pos].col >= 2) {
      if (squares[leftDown].piece == null || (squares[leftDown].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + leftDown);
      }
    }
    // 2 down, 1 right
    let downRight = pos + CONSTANTS.twoDownOneRight;

    if (squares[pos].row >= 2 && squares[pos].col <= 6) {
      if (squares[downRight].piece == null || (squares[downRight].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + downRight);
      }
    }
    // 2 down, 1 left
    let downLeft = pos + CONSTANTS.twoDownOneLeft;

    if (squares[pos].row >= 2 && squares[pos].col >= 1) {
      if (squares[downLeft].piece == null || (squares[downLeft].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + downLeft);
      }
    }
    return acceptedMoves;
  }

  isAllowebByKnight(piece, kingPosition) {

    const pos = 1 * piece.location;

    // 2 right, 1 up
    const rightUp = pos + CONSTANTS.twoRightOneUp;
    const allowed = true;

    if (rightUp === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    // 2 right, 1 down
    const rightDown = pos + CONSTANTS.twoRightOneDown;
    if (rightDown === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    // 2 up, 1 right
    const upRight = pos + CONSTANTS.twoUpOneRight;
    if (upRight === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    // 2 up, 1 left
    const upLeft = pos + 15;
    if (upLeft === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    // 2 left, 1 up
    const leftUp = pos + CONSTANTS.twoLeftOneUp;

    if (leftUp === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    // 2 left, 1 down
    const leftDown = pos + CONSTANTS.twoLeftOneDown;
    if (leftDown === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    // 2 down, 1 right
    const downRight = pos + CONSTANTS.twoDownOneRight;
    if (downRight === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    // 2 down, 1 left
    const downLeft = pos + CONSTANTS.twoDownOneLeft;
    if (downLeft === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    return allowed;
  }

  isAllowedByBlackPawn(piece, kingPosition) {
    const allowed = true;

    const pos = 1 * piece.location; // ensure this is a number

    let upLeft = pos + CONSTANTS.upLeft;
    let upRight = pos + CONSTANTS.upRight;
    if (upLeft === kingPosition) return false;
    if (upRight === kingPosition) return false;

    return allowed;
  }

  isAllowedByWhitePawn(piece, kingPosition) {
    const allowed = true;

    let pos = 1 * piece.location;

    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;
    if (downLeft === kingPosition) return false;
    if (downRight === kingPosition) return false;

    return allowed;
  }

  getCandidateBishopMoves(piece, squares) {

    let acceptedMoves = [];
    acceptedMoves = this.getCandidateDiagonalMovesUpRight(piece, squares, acceptedMoves);
    acceptedMoves = this.getCandidateDiagonalMovesUpLeft(piece, squares, acceptedMoves);
    acceptedMoves = this.getCandidateDiagonalMovesDownLeft(piece, squares, acceptedMoves);
    acceptedMoves = this.getCandidateDiagonalMovesDownRight(piece, squares, acceptedMoves);
    return acceptedMoves;
  }

  getCandidateDiagonalMovesUpRight(piece, squares, acceptedMoves) {

    let pos = 1 * piece.location;

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
        acceptedMoves.push(pos + '#' + dst);
      } else if (squares[dst].piece.white !== piece.white) {
        acceptedMoves.push(pos + '#' + dst); // eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    //console.log('up right moves =' + acceptedMoves.length);
    return acceptedMoves;
  }

  getCandidateDiagonalMovesUpLeft(piece, squares, acceptedMoves) {

    let pos = 1 * piece.location;

    const squaresAvailableLeft = squares[pos].col;
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
        acceptedMoves.push(pos + '#' + dst);
      } else if (squares[dst].piece.white !== piece.white) {
        acceptedMoves.push(pos + '#' + dst); // eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    //console.log('up left moves ='+acceptedMoves.length);
    return acceptedMoves;
  }

  getCandidateDiagonalMovesDownRight(piece, squares, acceptedMoves) {

    let pos = 1 * piece.location;

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
        acceptedMoves.push(pos + '#' + dst);
      } else if (squares[dst].piece.white !== piece.white) {
        acceptedMoves.push(pos + '#' + dst); // eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    //console.log('down right moves ='+ acceptedMoves.length);
    return acceptedMoves;
  }

  getCandidateDiagonalMovesDownLeft(piece, squares, acceptedMoves) {

    let pos = 1 * piece.location;

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
        acceptedMoves.push(pos + '#' + dst);
      } else if (squares[dst].piece.white !== piece.white) {
        acceptedMoves.push(pos + '#' + dst); // eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    //console.log('down left moves ='+acceptedMoves.length);
    return acceptedMoves;
  }

  getCandidateRookMoves(piece, squares) {

    console.log('<ROOK> moves </ROOK>');
    let pos = 1 * piece.location;

    let acceptedMoves = [];
    let UP = pos + CONSTANTS.up;
    let DOWN = pos + CONSTANTS.down;
    let LEFT = pos + CONSTANTS.left;
    let RIGHT = pos + CONSTANTS.right;

        // move UP
    for (let i = UP; i <= CONSTANTS.maxWhite; i += CONSTANTS.up) {

      if (squares[i].piece === null) {
        console.log('No PIECE i = ' + i);
        acceptedMoves.push(pos + '#' + i);
      } else if (squares[i].piece === undefined) {
        console.log('UNDEF PIECE i = ' + i);
        acceptedMoves.push(pos + '#' + i);
      } else if (piece.white !== squares[i].piece.white) { // eat

        acceptedMoves.push(pos + '#' + i); //FIXME, handle candidate move SRC, the piece doesn't exist there anymore...
        break; // no more move possibilities after eating
      } else {
        console.log('OWN PIECE i = ' + i);
        break; // own piece blocks
      }
    }

    // move DOWN
    for (let i = DOWN; i >= 0; i += CONSTANTS.down) {

     if (squares[i].piece === null) {
        acceptedMoves.push(pos + '#' + i);
      } else if (piece.white !== squares[i].piece.white) { // eat
        acceptedMoves.push(pos + '#' + i);
        break; // no more move possibilities after eating
      } else
        break; // own piece
      }

    // move RIGHT
    let movesRight = CONSTANTS.maxCol - squares[pos].col;

    for (let i = RIGHT; i <= (movesRight + pos); i++) {

      if (squares[i].piece === null) {
        acceptedMoves.push(pos + '#' + i);
      } else if (piece.white !== squares[i].piece.white) { // eat
        acceptedMoves.push(pos + '#' + i);
        break; // no more move possibilities after eating
      } else
        break; // own piece
      }

    // move LEFT
    let movesLeft = squares[pos].col;

    for (let i = LEFT; i >= (pos - movesLeft); i--) {
      if (squares[i].piece === null) {
        acceptedMoves.push(pos + '#' + i);
      } else if (piece.white !== squares[i].piece.white) { // eat
        acceptedMoves.push(pos + '#' + i);
        break; // no more move possibilities after eating
      } else
        break; // own piece
      }

    return acceptedMoves;
  }

  isAllowedByQueen(piece, squares, kingPosition, opponentCandidateMove, kingRow, kingCol) {

    let allowed = true;

    if (kingRow === piece.row || (kingCol === piece.col)) {
      allowed = this.isAllowedByRook(piece, squares, kingPosition, opponentCandidateMove);
      if (!allowed)
        return false;
      }
    allowed = this.isAllowedByBishop(piece, squares, kingPosition, opponentCandidateMove);

    return allowed
  }

  isAllowedByKing(piece, kingPosition) {
    let allowed = true;
    let pos = 1 * piece.location; // ensure this is dealt as an integer!

    let up = pos + CONSTANTS.up;
    let down = pos + CONSTANTS.down;
    let left = pos + CONSTANTS.left;
    let right = pos + CONSTANTS.right;
    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;
    let upLeft = pos + CONSTANTS.upLeft;
    let upRight = pos + CONSTANTS.upRight;

    if (up === kingPosition)
      return false; // reject move #1
    if (down === kingPosition)
      return false; // reject move #2
    if (left === kingPosition)
      return false; // reject move #3
    if (right === kingPosition)
      return false; // reject move #4
    if (downRight === kingPosition)
      return false; // reject move #5
    if (upRight === kingPosition)
      return false; // reject move #6
    if (upLeft === kingPosition)
      return false; // reject move #7
    if (downLeft === kingPosition)
      return false; // reject move #8

    return allowed;
  }

  isAllowedByBishop(piece, squares, kingPosition, opponentCandidateMove) {

    let canditSrc = 0;
    let canditDst = 0;

    let allowed = true;


    if (opponentCandidateMove !== undefined) {
      const move = opponentCandidateMove.split('#'); // [1] == dst move
      canditDst = 1 * move[1];
      canditSrc = 1 * move[0]; // ensure that it's an integer! (*1)
      }

    allowed = this.isDiagonalMovesUpRightAllowed(piece, squares, kingPosition, canditSrc, canditDst);
    if (!allowed)
      return false;
    allowed = this.isDiagonalMovesUpLeftAllowed(piece, squares, kingPosition, canditSrc, canditDst);
    if (!allowed)
      return false;
    allowed = this.isDiagonalMovesDownLeftAllowed(piece, squares, kingPosition, canditSrc, canditDst);
    if (!allowed)
      return false;
    allowed = this.isDiagonalMovesDownRightAllowed(piece, squares, kingPosition, canditSrc, canditDst);

    return allowed;
  }

  isAllowedByRook(piece, squares, kingPosition, opponentCandidateMove) {
    let allowed = true;

    let pos = 1 * piece.location;

    let UP = pos + CONSTANTS.up;
    let DOWN = pos + CONSTANTS.down;
    let LEFT = pos + CONSTANTS.left;
    let RIGHT = pos + CONSTANTS.right;
    console.log('candit = ' + opponentCandidateMove);

    let canditSrc = 0;
    let canditDst = 0;

    if (opponentCandidateMove !== undefined) {
      const move = opponentCandidateMove.split('#'); // [1] == dst move
      canditSrc = 1 * move[0];
      canditDst = 1 * move[1];

      if (canditDst === pos) {
        return allowed; // this piece has been eaten!
      }
    }

    // move UP
    for (let i = UP; i <= CONSTANTS.maxWhite; i += CONSTANTS.up) {

      //console.log('*****move dst = ' + i + ' KING = ' + kingPosition + ' canditSrc='+canditSrc+ ' canditDst='+canditDst);
      if (i === kingPosition) {
        console.log('collides with KING');
        return false; // this move wasn't allowed by the rook
      }
      let squarePiece =  squares[i].piece;

      if (i === canditDst) {
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (canditSrc === i) {
        continue;
      } else if (squarePiece !== null) {
        break; // move accepted; collides with own or eats opponent's piece; both are OK
      }
    }

    // move DOWN
    for (let i = DOWN; i >= 0; i += CONSTANTS.down) {

      console.log('*****move dst = ' + i + ' KING = ' + kingPosition + ' canditSrc=' + canditSrc + ' canditDst=' + canditDst);
      if (i === kingPosition) {
        return false;
      }
      let squarePiece =  squares[i].piece;

      if (i === canditDst) {
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (canditSrc === i) {
        continue;
      } else if (squarePiece !== null) {
        break; // move accepted; collides with own or eats opponent's piece; both are OK
      }
    }
    //console.log('rook moves DOWN = ' + acceptedMoves.length);

    // move RIGHT
    let movesRight = CONSTANTS.maxCol - squares[pos].col;

    for (let i = RIGHT; i <= (movesRight + pos); i++) {
      if (i === kingPosition) {
        return false;
      }
      let squarePiece =  squares[i].piece;

      if (i === canditDst) {
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (canditSrc === i) {
        continue;
      } else if (squarePiece !== null) {
        break; // move accepted; collides with own or eats opponent's piece; both are OK
      }
    }
    //console.log('rook moves RIGHT = ' + acceptedMoves.length);
    // move LEFT
    let movesLeft = squares[pos].col;

    for (let i = LEFT; i >= (pos - movesLeft); i--) {

      if (i === kingPosition) {
        return false;
      }
      let squarePiece =  squares[i].piece;

      if (i === canditDst) {
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (canditSrc === i) {
        continue;
      } else if (squarePiece !== null) {
        break; // move accepted; collides with own or eats opponent's piece; both are OK
      }
    }
    return allowed;
  }

  isDiagonalMovesUpRightAllowed(piece, squares, kingPosition, canditSrc, canditDst) {
    let pos = 1 * piece.location;
    let allowed = true;

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
      if (dst === kingPosition) {
        console.log('ERROR: king is eaten.');
        return false; // move cannot be accepted (king would be eaten)
      } else if (dst === canditDst) {
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (dst === canditSrc) {
        continue; // this piece doesn't block anymore
      } else if (squares[dst].piece !== null) { //canditSrc can't be here!
        // own or opponent's piece
        break;
      }
    }
    return allowed;
  }


  isDiagonalMovesUpLeftAllowed(piece, squares, kingPosition, canditSrc, canditDst) {
    let pos = 1 * piece.location;
    let allowed = true;

    const squaresAvailableLeft = squares[pos].col;
    const squaresAvailableUp = CONSTANTS.maxRow - squares[pos].row;
    let numberOfSquaresAvailable;

    if (squaresAvailableLeft <= squaresAvailableUp) {
      numberOfSquaresAvailable = squaresAvailableLeft;
    } else {
      numberOfSquaresAvailable = squaresAvailableUp;
    }

    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + (i * CONSTANTS.upLeft);

      if (dst === kingPosition) {
        return false; //move cannot be accepted (king would be eaten)
      }

      if (dst === canditSrc) {
        continue;
      } else if (dst === canditDst) {
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (squares[dst].piece !== null) {
        break;
      }
    }
    return allowed;
  }

  isDiagonalMovesDownRightAllowed(piece, squares, kingPosition, canditSrc, canditDst) {
    let pos = 1 * piece.location;
    let allowed = true;

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

      if (dst === kingPosition) {
        return false; //move cannot be accepted (king would be eaten)
      }

      if (dst === canditSrc) {
        continue;
      } else if (dst === canditDst) {
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (squares[dst].piece !== null) {
        break;
      }
    }
    return allowed;
  }

  isDiagonalMovesDownLeftAllowed(piece, squares, kingPosition, canditSrc, canditDst) {
    let pos = 1 * piece.location;
    let allowed = true;

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

      if (dst === kingPosition) {
        return false;
      }
      if (dst === canditSrc) {
        continue;
      } else if (dst === canditDst) {
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (squares[dst].piece !== null) {
        break;
      }
    }
    return allowed;
  }

  getCandidateQueenMoves(piece, squares) {

    let acceptedMovesQueen = [];

    let acceptedMovesBishop = this.getCandidateBishopMoves(piece, squares);
    let acceptedMovesRook = this.getCandidateRookMoves(piece, squares);
    acceptedMovesQueen = acceptedMovesBishop.concat(acceptedMovesRook);
    return acceptedMovesQueen;
  }
}

export default Moves;
