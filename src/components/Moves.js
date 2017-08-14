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

    let pos = 1*piece.location;

    const down = pos + CONSTANTS.down;
    let down2 = pos + CONSTANTS.down2;
    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;

    let acceptedMoves = [];
    this.setState({enPasse: down2});
    console.log('enPasse='+this.state.enPasse);

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

      if (this.state.enPasse === (pos + CONSTANTS.enPasseDownRight)) {
        //FIXME: replace with squares[RIGHT].piece.white == false
        if (squares[CONSTANTS.right].piece !== null && (squares[CONSTANTS.right].piece.value === CONSTANTS.whitePawnValue)) {
          acceptedMoves.push(pos + '#' + downRight); // en passe black pawn
        }
      }
    return acceptedMoves;
  }

  getBlackPawnMoves(piece, squares) {

    const pos = 1*piece.location; // ensure this is a number

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

      if (this.state.enPasse === (pos + CONSTANTS.enPasseUpRight)) {
        //FIXME: replace with squares[RIGHT].piece.white == false
        if (squares[CONSTANTS.right].piece !== null && (squares[CONSTANTS.right].piece.value === CONSTANTS.whitePawnValue)) {
          acceptedMoves.push(pos + '#' + upRight); // en passe black pawn
        }
      }
    return acceptedMoves;
  }

  getKnightMoves(piece, squares, opponentKing) {

    const pos = 1*piece.location;
    let acceptedMoves = [];

    // 2 right, 1 up
    const rightUp = pos + CONSTANTS.twoRightOneUp;

    if (rightUp === opponentKing) {
      return null; // move cannot be accepted (king would be eaten)
    }

    if (squares[pos].row <= 6 && squares[pos].col <= 5) { // check that the move stays on the board
      if (squares[rightUp].piece == null || (squares[rightUp].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + rightUp);
      }
    }
    // 2 right, 1 down
    let rightDown = pos + CONSTANTS.twoRightOneDown;
    if (rightDown === opponentKing) {
      return null; // move cannot be accepted (king would be eaten)
    }
    if (squares[pos].row >= 1 && squares[pos].col <= 5) { // check that the move stays on the board
      if (squares[rightDown].piece == null || (squares[rightDown].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + rightDown);
      }
    }

    // 2 up, 1 right
    let upRight = pos + CONSTANTS.twoUpOneRight;
    if (upRight === opponentKing) {
      return null; // move cannot be accepted (king would be eaten)
    }
    if (squares[pos].row <= 5 && squares[pos].col <= 6) {
      if (squares[upRight].piece == null || (squares[upRight].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + upRight);
      }
    }
    // 2 up, 1 left
    let upLeft = pos + 15;
    if (upLeft === opponentKing) {
      return null; // move cannot be accepted (king would be eaten)
    }
    if (squares[pos].row <= 5 && squares[pos].col >= 1) {
      if (squares[upLeft].piece == null || (squares[upLeft].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + upLeft);
      }
    }
    // 2 left, 1 up
    let leftUp = pos + CONSTANTS.twoLeftOneUp;

    if (leftUp === opponentKing) {
      return null; // move cannot be accepted (king would be eaten)
    }

    if (squares[pos].row <= 6 && squares[pos].col >= 2) {
      if (squares[leftUp].piece == null || (squares[leftUp].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + leftUp);
      }
    }

    // 2 left, 1 down
    let leftDown = pos + CONSTANTS.twoLeftOneDown;
    if (leftDown === opponentKing) {
      return null; // move cannot be accepted (king would be eaten)
    }

    if (squares[pos].row >= 1 && squares[pos].col >= 2) {
      if (squares[leftDown].piece == null || (squares[leftDown].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + leftDown);
      }
    }
    // 2 down, 1 right
    let downRight = pos + CONSTANTS.twoDownOneRight;
    if (downRight === opponentKing) {
      return null; // move cannot be accepted (king would be eaten)
    }
    if (squares[pos].row >= 2 && squares[pos].col <= 6) {
      if (squares[downRight].piece == null || (squares[downRight].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + downRight);
      }
    }
    // 2 down, 1 left
    let downLeft = pos + CONSTANTS.twoDownOneLeft;
    if (downLeft === opponentKing) {
      return null; // move cannot be accepted (king would be eaten)
    }
    if (squares[pos].row >= 2 && squares[pos].col >= 1) {
      if (squares[downLeft].piece == null || (squares[downLeft].piece.white !== piece.white)) {
        acceptedMoves.push(pos + '#' + downLeft);
      }
    }
    return acceptedMoves;
  }

  getBishopMoves(piece, squares, opponentKing, opponentCandidateMove) {

    let acceptedMoves = [];

    let canditSrc = 0;
    let canditDst = 0;

    if (opponentCandidateMove !== undefined) {
        const move = opponentCandidateMove.split('#'); // [1] == dst move
        canditSrc = 1*move[0]; // ensure that it's an integer! (*1)
        canditDst = 1*move[1];
    }

    //console.log('A-testing diagonal UR, opponentKing = ' + opponentKing + ' opponentCandidateMove = ' + opponentCandidateMove);
    acceptedMoves = this.getDiagonalMovesUpRight(piece, squares, acceptedMoves, opponentKing, canditSrc, canditDst);
    if (acceptedMoves == null) return null;
    acceptedMoves = this.getDiagonalMovesUpLeft(piece, squares, acceptedMoves, opponentKing, canditSrc, canditDst);
    if (acceptedMoves == null) return null;
    acceptedMoves = this.getDiagonalMovesDownLeft(piece, squares, acceptedMoves, opponentKing, canditSrc, canditDst);
    if (acceptedMoves == null) return null;
    acceptedMoves = this.getDiagonalMovesDownRight(piece, squares, acceptedMoves, opponentKing, canditSrc, canditDst);

    return acceptedMoves;
  }

  getDiagonalMovesUpRight(piece, squares, acceptedMoves, opponentKing, canditSrc, canditDst) {
    console.log('testing diagonal UR, opponentKing = ' + opponentKing + ' canditDst = ' + canditDst + ' white =' + piece.white);

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
      if (dst === opponentKing) {
        console.log('ERROR: king is eaten.');
        return null; // move cannot be accepted (king would be eaten)
      }
      if (i === canditSrc) {
        acceptedMoves.push(pos + '#' + i);
        console.log('i equals candirSrc, i = ' + i);
      } else if (i === canditDst) {
        acceptedMoves.push(pos + '#' + i);
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (squares[dst].piece == null || dst === canditSrc) {
        acceptedMoves.push(pos + '#' + dst);
      } else if (squares[dst].piece.white !== piece.white) {
        acceptedMoves.push(pos + '#' + dst);// eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    //console.log('up right moves =' + acceptedMoves.length);
    return acceptedMoves;
  }

  getDiagonalMovesUpLeft(piece, squares, acceptedMoves, opponentKing, canditSrc, canditDst) {

    let pos = 1 * piece.location;

    let squaresAvailableLeft = squares[pos].col;

    const squaresAvailableUp = CONSTANTS.maxRow - squares[pos].row;

    let numberOfSquaresAvailable;

    if (squaresAvailableLeft <= squaresAvailableUp) {
      numberOfSquaresAvailable = squaresAvailableLeft;
    } else {
      numberOfSquaresAvailable = squaresAvailableUp;
    }

    if (pos === canditDst) return acceptedMoves; // this piece has been eaten!

    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + (i * CONSTANTS.upLeft);
      if (dst === opponentKing) {
        return null; //move cannot be accepted (king would be eaten)
      }

      if (i === canditSrc) {
        acceptedMoves.push(pos + '#' + i);
        console.log('i equals candirSrc, i = ' + i);
      } else if (i === canditDst) {
        acceptedMoves.push(pos + '#' + i);
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (squares[dst].piece == null) {
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

  getDiagonalMovesDownRight(piece, squares, acceptedMoves, opponentKing, canditSrc, canditDst) {

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

      if (dst === opponentKing) {
        return null; //move cannot be accepted (king would be eaten)
      }

      if (i === canditSrc) {
        acceptedMoves.push(pos + '#' + i);
        console.log('i equals candirSrc, i = ' + i);
      } else if (i === canditDst) {
        acceptedMoves.push(pos + '#' + i);
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (squares[dst].piece == null) {
        acceptedMoves.push(pos + '#' + dst);
      } else if (squares[dst].piece.white !== piece.white) {
        acceptedMoves.push(pos + '#' + dst);// eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    //console.log('down right moves ='+ acceptedMoves.length);
    return acceptedMoves;
  }


  getDiagonalMovesDownLeft(piece, squares, acceptedMoves, opponentKing, canditSrc, canditDst) {

    //FIXME, BUG in move counting
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

      if (dst === opponentKing) {
        return null; //FIXME, move cannot be accepted (king would be eaten)
      }
      if (i === canditSrc) {
        acceptedMoves.push(pos + '#' + i);
        console.log('i equals candirSrc, i = ' + i);
      } else if (i === canditDst) {
        acceptedMoves.push(pos + '#' + i);
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (squares[dst].piece == null) {
        acceptedMoves.push(pos + '#' + dst);
      } else if (squares[dst].piece.white !== piece.white) {
        acceptedMoves.push(pos + '#' + dst);// eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    //console.log('down left moves ='+acceptedMoves.length);
    return acceptedMoves;
  }

  getRookMoves(piece, squares, opponentKing, opponentCandidateMove) {

    console.log('<ROOK> moves </ROOK>');
    let pos = 1 * piece.location;

    let acceptedMoves = [];
    let UP = pos + CONSTANTS.up;
    let DOWN = pos + CONSTANTS.down;
    let LEFT = pos + CONSTANTS.left;
    let RIGHT = pos + CONSTANTS.right;
    console.log('candit = ' + opponentCandidateMove);

    let canditSrc = 0;
    let canditDst = 0;

    if (opponentCandidateMove !== undefined) {
        const move = opponentCandidateMove.split('#'); // [1] == dst move
        canditSrc = 1*move[0]; // ensure that it's an integer! (*1)
        canditDst = 1*move[1];
        if (canditDst === piece.location) return acceptedMoves; // this piece has been eaten!
    }

    // move UP
    for (let i = UP; i <= CONSTANTS.maxWhite; i += CONSTANTS.up) {

      //console.log('*****move dst = ' + i + ' KING = ' + opponentKing + ' canditSrc='+canditSrc+ ' canditDst='+canditDst);
      if (i === opponentKing) {
        console.log('collides with KING');
        return null; //FIXME, move cannot be accepted (king would be eaten)
      }

      if (i === canditSrc) {
        acceptedMoves.push(pos + '#' + i);
        console.log('i equals candirSrc, i = ' + i);
      } else if (i === canditDst) {
        acceptedMoves.push(pos + '#' + i);
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (squares[i].piece === null) {
        console.log('No PIECE i = ' + i);
        acceptedMoves.push(pos + '#' + i);
      } else if (squares[i].piece === undefined) {
        console.log('UNDEF PIECE i = ' + i);
        acceptedMoves.push(pos + '#' + i);
      } else if (piece.white !== squares[i].piece.white) { // eat
        console.log('EATS PIECE i = ' + i + ' opponentKing = ' + opponentKing + ' canditDst='+canditDst+ 'canditSrc='+canditSrc);
        acceptedMoves.push(pos + '#' + i); //FIXME, handle candidate move SRC, the piece doesn't exist there anymore...
        break; // no more move possibilities after eating
      } else {
        console.log('OWN PIECE i = ' + i);
        break; // own piece blocks
      }
    }
    //console.log('rook moves UP = ' + acceptedMoves.length);
    // move DOWN
    for (let i = DOWN; i >= 0; i += CONSTANTS.down) {
      console.log('*****move dst = ' + i + ' KING = ' + opponentKing + ' canditSrc='+canditSrc+ ' canditDst='+canditDst);
      if (i === opponentKing) {
        return null; //FIXME, move cannot be accepted (king would be eaten)
      }

      if (i === canditSrc) {
        acceptedMoves.push(pos + '#' + i);
        console.log('i equals candirSrc, i = ' + i);
      } else if (i === canditDst) {
        acceptedMoves.push(pos + '#' + i);
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (squares[i].piece === null) {
        acceptedMoves.push(pos + '#' + i);
      } else if (piece.white !== squares[i].piece.white || (i === opponentCandidateMove)) { // eat
        acceptedMoves.push(pos + '#' + i);
        break; // no more move possibilities after eating
      } else break; // own piece
    }
    //console.log('rook moves DOWN = ' + acceptedMoves.length);

    // move RIGHT
    let movesRight = CONSTANTS.maxCol - squares[pos].col;

    for (let i = RIGHT; i <= (movesRight + pos); i++) {
      if (i === opponentKing) {
        return null; //FIXME, move cannot be accepted (king would be eaten)
      }
      if (i === canditSrc) {
        acceptedMoves.push(pos + '#' + i);
        console.log('i equals candirSrc, i = ' + i);
      } else if (i === canditDst) {
        acceptedMoves.push(pos + '#' + i);
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (squares[i].piece === null) {
        acceptedMoves.push(pos + '#' + i);
      } else if (piece.white !== squares[i].piece.white || (i === opponentCandidateMove))  { // eat
        acceptedMoves.push(pos + '#' + i);
        break; // no more move possibilities after eating
      } else break; // own piece
    }
    //console.log('rook moves RIGHT = ' + acceptedMoves.length);
    // move LEFT
    let movesLeft = squares[pos].col;

    for (let i = LEFT; i >= (pos - movesLeft); i--) {
      if (i === opponentKing) {
        return null; //FIXME, move cannot be accepted (king would be eaten)
      }

      if (i === canditSrc) {
        acceptedMoves.push(pos + '#' + i);
        console.log('i equals candirSrc, i = ' + i);
      } else if (i === canditDst) {
        acceptedMoves.push(pos + '#' + i);
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (squares[i].piece === null) {
        acceptedMoves.push(pos + '#' + i);
      } else if (piece.white !== squares[i].piece.white || (i === opponentCandidateMove)) { // eat
        acceptedMoves.push(pos + '#' + i);
        break; // no more move possibilities after eating
      } else break; // own piece
    }
    //console.log('rook moves LEFT = ' + acceptedMoves.length);
    return acceptedMoves;
  }

  allowedByQueen(piece, squares, opponentKing, opponentCandidateMove) {
    let allowed = true;
    const pos = 1 * piece.location;
    //let canditSrc = 0;
    let canditDst = 0;

    if (opponentCandidateMove !== undefined) {
        const move = opponentCandidateMove.split('#'); // [1] == dst move
        //canditSrc = 1*move[0]; // ensure that it's an integer! (*1)
        canditDst = 1*move[1];
        if (canditDst === pos) return allowed; // this queen has been eaten (for this candidate move)!
    }

    allowed = this.isAllowedByBishop(piece, squares, opponentKing, opponentCandidateMove);


    return allowed
  }

  isAllowedByBishop(piece, squares, opponentKing, opponentCandidateMove) {

    let canditSrc = 0;
    let canditDst = 0;

    let allowed = true;
    if (opponentCandidateMove !== undefined) {
        const move = opponentCandidateMove.split('#'); // [1] == dst move
        canditSrc = 1*move[0]; // ensure that it's an integer! (*1)
        canditDst = 1*move[1];
    }


    allowed = this.isDiagonalMovesUpRightAllowed(piece, squares, opponentKing, canditSrc, canditDst);
    if (!allowed) return false;
    allowed = this.isDiagonalMovesUpLeftAllowed(piece, squares, opponentKing, canditSrc, canditDst);
    if (!allowed) return false;
    allowed = this.isDiagonalMovesDownLeftAllowed(piece, squares, opponentKing, canditSrc, canditDst);
    if (!allowed) return false;
    allowed = this.isDiagonalMovesDownRightAllowed(piece, squares, opponentKing, canditSrc, canditDst);

    return allowed;
  }

  isDiagonalMovesUpRightAllowed(piece, squares, opponentKing, canditSrc, canditDst) {
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
      if (dst === opponentKing) {
        console.log('ERROR: king is eaten.');
        return false; // move cannot be accepted (king would be eaten)
      } else if (i === canditDst) {
        console.log('Move accepted, collides with candit dst, OK.');
        break;
      } else if (squares[dst].piece !== null) {
        // own or opponent's piece
        break;
      }
    }
    return allowed;
  }


  getQueenMoves(piece, squares, opponentKing, opponentCandidateMove) {
    //console.log('B-testing diagonal UR, opponentKing = ' + opponentKing + ' opponentCandidateMove = ' + opponentCandidateMove);

    let acceptedMovesQueen = [];

    if (opponentCandidateMove !== undefined) {
        const move = opponentCandidateMove.split('#'); // [1] == dst move
        const canditDst = 1*move[1];
        if (canditDst === piece.location) return acceptedMovesQueen; // this piece has been eaten!
    }

    let acceptedMovesBishop = this.getBishopMoves(piece, squares, opponentKing, opponentCandidateMove);
    if (acceptedMovesBishop == null) {
      return null;
    }
//    console.log('queen: bishop moves =' + acceptedMovesBishop.length);
    let acceptedMovesRook = [];
    if (opponentCandidateMove !== undefined) {
      let row = squares[opponentKing].row;
      let col = squares[opponentKing].col;
      if (row !== piece.row && (col !== piece.col)) {
        acceptedMovesRook = this.getRookMoves(piece, squares, opponentKing, opponentCandidateMove);
        if (acceptedMovesRook == null) {
          console.log('QUEEN move rejected');
          return null;
        }
      }
    }
  //  console.log('queen: rook moves =' + acceptedMovesRook.length);
    acceptedMovesQueen = acceptedMovesBishop.concat(acceptedMovesRook);
    //console.log('\n All accepted queen moves = ' + acceptedMovesQueen + ' for piece: ' + piece.type);
    return acceptedMovesQueen;
  }
}

export default Moves;
