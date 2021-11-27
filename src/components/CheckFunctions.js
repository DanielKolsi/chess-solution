import CONSTANTS from "../config/constants";
import * as HelpFunctions from "./HelpFunctions";


/**
 * 
 * @param {*} board 
 * @param {*} allowedMove 
 * @param {*} white 
 */
export function getCheckPlusSymbolForPawnMove(board, allowedMove, white) {

  const moves = HelpFunctions.getMovesString(allowedMove);
  const src = parseInt(moves[0], 10);
  const dst = parseInt(moves[1], 10);

  let KING_CODE = white ? CONSTANTS.BLACK_KING_CODE : CONSTANTS.WHITE_KING_CODE;

  if (white) {
    const DOWNLEFT_DST = dst + CONSTANTS.downLeft;
    const DOWNRIGHT_DST = dst + CONSTANTS.downRight;
    if (board[dst].col > 0) {
      if (
        board[DOWNLEFT_DST].piece !== null &&
        board[DOWNLEFT_DST].piece.value ===
          KING_CODE
      ) {
        allowedMove = src + CONSTANTS.CHECK + dst;
        return allowedMove;
      }
    }
    if (board[dst].col < 7) {
      if (
        board[DOWNRIGHT_DST].piece !== null &&
        board[DOWNRIGHT_DST].piece.value ===
          KING_CODE
      ) {
        allowedMove = src + CONSTANTS.CHECK + dst;
        return allowedMove;
      }
    }
  } else {
    const UPLEFT_DST = dst + CONSTANTS.upLeft;
    const UPRIGHT_DST = dst + CONSTANTS.upRight;


    if (board[dst].col > 0) {
      if (
        board[UPLEFT_DST].piece !== null &&
        board[UPLEFT_DST].piece.value ===
          KING_CODE
      ) {
        allowedMove = src + CONSTANTS.CHECK + dst;
        return allowedMove;
      }
    }
    if (board[dst].col < 7) {
      if (
        board[UPRIGHT_DST].piece !== null &&
        board[UPRIGHT_DST].piece.value ===
          KING_CODE
      ) {
        allowedMove = src + CONSTANTS.CHECK + dst;
        return allowedMove;
      }
    }
  }
  return allowedMove;
}

/**
 * 
 * @param {*} board 
 * @param {*} allowedMove 
 * @returns 
 */
export function getCheckPlusSymbolForKnightMove(board, allowedMove, white) {

  const moves = HelpFunctions.getMovesString(allowedMove);
  const src = parseInt(moves[0], 10);
  const dst = parseInt(moves[1], 10);

  let KING_CODE = white ? CONSTANTS.BLACK_KING_CODE : CONSTANTS.WHITE_KING_CODE;

  const TWO_RIGHT_ONE_UP_DST = dst + CONSTANTS.twoRightOneUp;
  const TWO_DOWN_ONE_RIGHT_DST = dst + CONSTANTS.twoDownOneRight;
  const TWO_RIGHT_ONE_DOWN_DST = dst + CONSTANTS.twoRightOneDown;

  const TWO_UP_ONE_RIGHT_DST = dst + CONSTANTS.twoUpOneRight;

  const TWO_UP_ONE_LEFT_DST = dst + CONSTANTS.twoUpOneLeft;
  const TWO_LEFT_ONE_UP_DST = dst + CONSTANTS.twoLeftOneUp;
  const TWO_LEFT_ONE_DOWN_DST = dst + CONSTANTS.twoLeftOneDown;

  const TWO_DOWN_ONE_LEFT_DST = dst + CONSTANTS.twoDownOneLeft;

  if (board[dst].row <= 6 && board[dst].col <= 5) {
    // check that the move stays on the board 2R-1U
    if (
      board[TWO_RIGHT_ONE_UP_DST].piece !== null &&
      board[TWO_RIGHT_ONE_UP_DST].piece.value ===
        KING_CODE
    ) {
      allowedMove = src + CONSTANTS.CHECK + dst;
      return allowedMove;
    }
  }
  
  if (board[dst].row >= 2 && board[dst].col <= 6) {
    if (
      board[TWO_DOWN_ONE_RIGHT_DST].piece !== null &&
      board[TWO_DOWN_ONE_RIGHT_DST].piece.value ===
        KING_CODE
    ) {            
      allowedMove = src + CONSTANTS.CHECK + dst;
      return allowedMove;
    }
  }

  // 2 right, 1 down
  if (board[dst].row >= 1 && board[dst].col <= 5) {
    if (
      board[TWO_RIGHT_ONE_DOWN_DST].piece !== null &&
      board[TWO_RIGHT_ONE_DOWN_DST].piece.value ===
        KING_CODE
    ) {
      allowedMove = src + CONSTANTS.CHECK + dst;
      return allowedMove;
    }
  }

  if (
    // 2 up, 1 right
    board[dst].row <= 5 &&
    board[dst].col <= 6
  ) {
    if (
      board[TWO_UP_ONE_RIGHT_DST].piece !== null &&
      board[TWO_UP_ONE_RIGHT_DST].piece.value ===
        KING_CODE
    ) {
      allowedMove = src + CONSTANTS.CHECK + dst;
      return allowedMove;
    }
  }

  if (
    // 2 up, 1 left
    board[dst].row <= 5 &&
    board[dst].col >= 1
  ) {
    if (
      board[TWO_UP_ONE_LEFT_DST].piece !== null &&
      board[TWO_UP_ONE_LEFT_DST].piece.value === KING_CODE
    ) {
      allowedMove = src + CONSTANTS.CHECK + dst;
      return allowedMove;
    }
  }

  if (
    // 2L-1U
    board[dst].row <= 6 &&
    board[dst].col >= 2
  ) {
    if (
      board[TWO_LEFT_ONE_UP_DST].piece !== null &&
      board[TWO_LEFT_ONE_UP_DST].piece.value === KING_CODE
    ) {
      allowedMove = src + CONSTANTS.CHECK + dst;
      return allowedMove;
    }
  }

  if (
    // 2L-1D
    board[dst].row >= 1 &&
    board[dst].col >= 2
  ) {
    if (
      board[TWO_LEFT_ONE_DOWN_DST].piece !== null &&
      board[TWO_LEFT_ONE_DOWN_DST].piece.value ===
        KING_CODE
    ) {
      allowedMove = src + CONSTANTS.CHECK + dst;
      return allowedMove;
    }
  }
  if (
    // 2D-1L
    board[dst].row >= 2 &&
    board[dst].col >= 1
  ) {
    if (
      board[TWO_DOWN_ONE_LEFT_DST].piece !== null &&
      board[TWO_DOWN_ONE_LEFT_DST].piece.value ===
        KING_CODE
    ) {
      allowedMove = src + CONSTANTS.CHECK + dst;
      return allowedMove;
    }
  }
  return allowedMove;
}

export function getCheckPlusSymbolForBishopMove(board, allowedMove, white) {
  const moves = HelpFunctions.getMovesString(allowedMove);
  const src = parseInt(moves[0], 10);
  const dst = parseInt(moves[1], 10);

  let KING_CODE = white ? CONSTANTS.BLACK_KING_CODE : CONSTANTS.WHITE_KING_CODE;

  let squaresAvailableRight =
    CONSTANTS.maxCol - board[dst].col;
  let squaresAvailableUp = CONSTANTS.maxRow - board[dst].row;

  // UPRIGHT
  let numberOfSquaresAvailable = (squaresAvailableRight < squaresAvailableUp) ? squaresAvailableRight : squaresAvailableUp;
  
  for (let i = 1; i <= numberOfSquaresAvailable; i++) { 
    let dstUR = dst + i * CONSTANTS.upRight;

    if (board[dstUR].piece === null) {
      continue;
    } else if (board[dstUR].piece.value === KING_CODE) {   
      allowedMove = src + CONSTANTS.CHECK + dst;  
      return allowedMove; // do the '+' conversion
    } else {
      break; // blocked by non-king piece 
    }
  }

  let squaresAvailableLeft = board[dst].col;
  squaresAvailableUp = CONSTANTS.maxRow - board[dst].row;

  // UPLEFT
  numberOfSquaresAvailable = (squaresAvailableLeft < squaresAvailableUp) ? squaresAvailableLeft : squaresAvailableUp;

  for (let i = 1; i <= numberOfSquaresAvailable; i++) { 
    let dstUL = dst + i * CONSTANTS.upLeft;

    if (board[dstUL].piece === null) {
      continue;
    } else if (board[dstUL].piece.value === KING_CODE) {   
      allowedMove = src + CONSTANTS.CHECK + dst;  
      return allowedMove; // do the '+' conversion
    } else {
      break; // blocked by non-king piece 
    }
  }

  
  let squaresAvailableDown = board[dst].row;

  // DOWNRIGHT
  numberOfSquaresAvailable = (squaresAvailableRight < squaresAvailableDown) ? squaresAvailableRight : squaresAvailableDown;
  for (let i = 1; i <= numberOfSquaresAvailable; i++) { 
    let dstDR = dst + i * CONSTANTS.downRight;

    if (board[dstDR].piece === null) {
      continue;
    } else if (board[dstDR].piece.value === KING_CODE) {   
      allowedMove = src + CONSTANTS.CHECK + dst;  
      return allowedMove; // do the '+' conversion
    } else {
      break; // blocked by non-king piece 
    }
  }

  
  // DOWNLEFT
  numberOfSquaresAvailable = (squaresAvailableLeft < squaresAvailableDown) ? squaresAvailableLeft : squaresAvailableDown;

  for (let i = 1; i <= numberOfSquaresAvailable; i++) { 
    let dstDL = dst + i * CONSTANTS.downLeft;

    if (board[dstDL].piece === null) {
      continue;
    } else if (board[dstDL].piece.value === KING_CODE) {   
      allowedMove = src + CONSTANTS.CHECK + dst;  
      return allowedMove; // do the '+' conversion
    } else {
      break; // blocked by non-king piece 
    }
  }
  return allowedMove;
}

export function getCheckPlusSymbolForRookMove(board, allowedMove, white) {
  const moves = HelpFunctions.getMovesString(allowedMove);
  const src = parseInt(moves[0], 10);
  const dst = parseInt(moves[1], 10);

  let KING_CODE = white ? CONSTANTS.BLACK_KING_CODE : CONSTANTS.WHITE_KING_CODE;

  let UP = dst + CONSTANTS.up;
  let DOWN = dst + CONSTANTS.down;
  let LEFT = dst + CONSTANTS.left;
  let RIGHT = dst + CONSTANTS.right;

  // move UP
  for (let i = UP; i <= CONSTANTS.maxWhite; i += CONSTANTS.up) {
    if (board[i].piece === null) {
      continue;
    } else if (board[dst].piece.value === KING_CODE) {  
      allowedMove = src + CONSTANTS.CHECK + dst;  
      return allowedMove; // do the '+' conversion
    } else {
      break; 
    }
  }

  // move DOWN
  for (let i = DOWN; i >= 0; i += CONSTANTS.down) {
    if (board[i].piece === null) {
      continue;
    } else if (board[dst].piece.value === KING_CODE) {        
      allowedMove = src + CONSTANTS.CHECK + dst; 
      return allowedMove; 
      
    } else break; 
  }

  // move RIGHT
  let movesRight = CONSTANTS.maxCol - board[dst].col;

  for (let i = RIGHT; i <= movesRight + dst; i++) {
    if (board[i].piece === null) {
      continue;
     } else if (board[dst].piece.value === KING_CODE) {  
      allowedMove = src + CONSTANTS.CHECK + dst;  
      return allowedMove;
      
    } else break; 
  }

  // move LEFT
  let movesLeft = board[dst].col;

  for (let i = LEFT; i >= dst - movesLeft; i--) {
    if (board[i].piece === null) {
      continue;
    } else if (board[dst].piece.value === KING_CODE) {  
      allowedMove = src + CONSTANTS.CHECK + dst;        
      return allowedMove;
    } else break; 
  }
  return allowedMove;
}

export function getCheckPlusSymbolForQueenMove(board, allowedMove, white) {
  let KING_CODE = white ? CONSTANTS.BLACK_KING_CODE : CONSTANTS.WHITE_KING_CODE;
  //getCheckPlusSymbolForRookMove();
  //getCheckPlusSymbolForBishopMove;
}


export function getCandidateRookMoves(piece, squares) {
  const DLM = CONSTANTS.defaultDelim;
  let pos = piece.currentSquare;

  let candidateMoves = [];
  let UP = pos + CONSTANTS.up;
  let DOWN = pos + CONSTANTS.down;
  let LEFT = pos + CONSTANTS.left;
  let RIGHT = pos + CONSTANTS.right;

  // move UP
  for (let i = UP; i <= CONSTANTS.maxWhite; i += CONSTANTS.up) {
    if (squares[i].piece === null) {
      candidateMoves.push(pos + DLM + i);
    } else if (squares[i].piece === undefined) {
      candidateMoves.push(pos + DLM + i);
    } else if (piece.white !== squares[i].piece.white) {
      // eat
      candidateMoves.push(pos + DLM + i);
      break; // no more move possibilities after eating
    } else {
      break; // own piece blocks
    }
  }

  // move DOWN
  for (let i = DOWN; i >= 0; i += CONSTANTS.down) {
    if (squares[i].piece === null) {
      candidateMoves.push(pos + DLM + i);
    } else if (piece.white !== squares[i].piece.white) {
      // eat
      candidateMoves.push(pos + DLM + i); // FIXME: # could be changed to X for eating
      break; // no more move possibilities after eating
    } else break; // own piece
  }

  // move RIGHT
  let movesRight = CONSTANTS.maxCol - squares[pos].col;

  for (let i = RIGHT; i <= movesRight + pos; i++) {
    if (squares[i].piece === null) {
      candidateMoves.push(pos + DLM + i);
    } else if (piece.white !== squares[i].piece.white) {
      // eat
      candidateMoves.push(pos + DLM + i);
      break; // no more move possibilities after eating
    } else break; // own piece
  }

  // move LEFT
  let movesLeft = squares[pos].col;

  for (let i = LEFT; i >= pos - movesLeft; i--) {
    if (squares[i].piece === null) {
      candidateMoves.push(pos + DLM + i);
    } else if (piece.white !== squares[i].piece.white) {
      // eat
      candidateMoves.push(pos + DLM + i);
      break; // no more move possibilities after eating
    } else break; // own piece
  }
  return candidateMoves;
}

export function isAllowedByOpponentQueen(
  piece,
  squares,
  kingPosition,
  candidateMove
) {
  let allowed = true;
  const pos = piece.currentSquare;
  if (pos < 0) return allowed; // ignore to-be-promoted extra pieces

  allowed = isAllowedByOpponentRook(
    piece,
    squares,
    kingPosition,
    candidateMove
  );

  if (!allowed) return false;

  allowed = isAllowedByOpponentBishop(
    piece,
    squares,
    kingPosition,
    candidateMove
  );

  return allowed;
}


export function isAllowedByOpponentBishop(
  piece,
  squares,
  kingPosition,
  opponentCandidateMove
) {
  const DLM = CONSTANTS.defaultDelim;
  let canditSrc = 0;
  let canditDst = 0;

  let allowed = true;

  if (opponentCandidateMove !== undefined) {
    const move = opponentCandidateMove.split(DLM); // [1] === dst move
    canditSrc = parseInt(move[0], 10); // ensure that it's an integer!
    canditDst = parseInt(move[1], 10);
  }

  allowed = isDiagonalMovesUpRightAllowed(
    piece,
    squares,
    kingPosition,
    canditSrc,
    canditDst
  );
 
  if (!allowed) return false;
  allowed = isDiagonalMovesUpLeftAllowed(
    piece,
    squares,
    kingPosition,
    canditSrc,
    canditDst
  );
  if (!allowed) return false;
  allowed = isDiagonalMovesDownLeftAllowed(
    piece,
    squares,
    kingPosition,
    canditSrc,
    canditDst
  );
  if (!allowed) return false;
  allowed = isDiagonalMovesDownRightAllowed(
    piece,
    squares,
    kingPosition,
    canditSrc,
    canditDst
  );

  return allowed;
}

export function isAllowedByOpponentRook(
  piece,
  squares,
  kingPosition,
  opponentCandidateMove
) {
  const DLM = CONSTANTS.defaultDelim;
  let allowed = true;

  let pos = piece.currentSquare;

  let UP = pos + CONSTANTS.up;
  let DOWN = pos + CONSTANTS.down;
  let LEFT = pos + CONSTANTS.left;
  let RIGHT = pos + CONSTANTS.right;

  let canditSrc = 0;
  let canditDst = 0;

  if (opponentCandidateMove !== undefined) {
    const move = opponentCandidateMove.split(DLM); // [1] === dst move
    canditSrc = parseInt(move[0], 10);
    canditDst = parseInt(move[1], 10);
  }

  // move UP
  for (let i = UP; i <= CONSTANTS.maxWhite; i += CONSTANTS.up) {
    /* eslint-disable */
    if (i == kingPosition) {
      return false; // this move wasn't allowed by the rook
    }
    let squarePiece = squares[i].piece;

    if (i == canditDst) {
      break;
    } else if (canditSrc == i) {
      continue;
      /* eslint-enable */
    } else if (squarePiece !== null) {
      break; // move accepted; collides with own or eats opponent's piece; both are OK
    }
  }

  // move DOWN
  for (let i = DOWN; i >= 0; i += CONSTANTS.down) {
    /* eslint-disable */
    if (i == kingPosition) {
      return false;
    }
    let squarePiece = squares[i].piece;

    if (i == canditDst) {
      break;
    } else if (canditSrc == i) {
      /* eslint-enable */
      continue;
    } else if (squarePiece !== null) {
      break; // move accepted; collides with own or eats opponent's piece; both are OK
    }
  }

  // move RIGHT
  let movesRight = CONSTANTS.maxCol - squares[pos].col;

  for (let i = RIGHT; i <= movesRight + pos; i++) {
    /* eslint-disable */
    if (i == kingPosition) {
      return false;
    }
    let squarePiece = squares[i].piece;
    
    if (i == canditDst) {
      break;
    } else if (canditSrc == i) {
      /* eslint-enable */
      continue;
    } else if (squarePiece !== null) {
      break; // move accepted; collides with own or eats opponent's piece; both are OK
    }
  }

  // move LEFT
  let movesLeft = squares[pos].col;

  for (let i = LEFT; i >= pos - movesLeft; i--) {
    /* eslint-disable */    
    if (i == kingPosition) {
      return false;
    }
    let squarePiece = squares[i].piece;

    if (i == canditDst) {
      break;
    } else if (canditSrc == i) {
    /* eslint-enable */  
      continue;
    } else if (squarePiece !== null) {
      break; // move accepted; collides with own or eats opponent's piece; both are OK
    }
  }
  return allowed;
}

export function isDiagonalMovesUpRightAllowed(
  piece,
  squares,
  kingPosition,
  canditSrc,
  canditDst
) {
  let currentPieceSquare = piece.currentSquare;
  let allowed = true;

  let squaresAvailableRight =
    CONSTANTS.maxCol - squares[currentPieceSquare].col;
  let squaresAvailableUp = CONSTANTS.maxRow - squares[currentPieceSquare].row;

  let numberOfSquaresAvailable;

  if (squaresAvailableRight <= squaresAvailableUp) {
    numberOfSquaresAvailable = squaresAvailableRight;
  } else {
    numberOfSquaresAvailable = squaresAvailableUp;
  }


  for (let i = 1; i <= numberOfSquaresAvailable; i++) {
    let dst = currentPieceSquare + i * CONSTANTS.upRight;
    /* eslint-disable */
    if (kingPosition == dst) {
      return false; // move cannot be accepted (king would be eaten)
    } else if (dst == canditDst) {
      break;
    // eslint-disable-next-line 
    } else if (dst == canditSrc) {
      /* eslint-enable */
      continue; // this piece doesn't block anymore
    } else if (squares[dst].piece !== null) {
      //canditSrc can't be here!
      // own or opponent's piece
      break;
    }
  }
  return allowed;
}

export function isDiagonalMovesUpLeftAllowed(
  piece,
  squares,
  kingPosition,
  canditSrc,
  canditDst
) {
  let pos = piece.currentSquare;
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
    /* eslint-disable */
    let dst = pos + i * CONSTANTS.upLeft;

    if (dst == kingPosition) {
      return false; //move cannot be accepted (king would be eaten)
    }

    if (dst == canditSrc) {
      continue;
    } else if (dst == canditDst) {
      break;
      /* eslint-enable */
    } else if (squares[dst].piece !== null) {
      break;
    }
  }
  return allowed;
}

export function isDiagonalMovesDownRightAllowed(
  piece,
  squares,
  kingPosition,
  canditSrc,
  canditDst
) {
  let pos = piece.currentSquare;
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
    let dst = pos + i * CONSTANTS.downRight;
  /* eslint-disable */
    if (dst == kingPosition) {
      return false; //move cannot be accepted (king would be eaten)
    }

    if (dst == canditSrc) {
      continue;
    } else if (dst == canditDst) {
      /* eslint-enable */
      break;
    } else if (squares[dst].piece !== null) {
      break;
    }
  }
  return allowed;
}

export function isDiagonalMovesDownLeftAllowed(
  piece,
  squares,
  kingPosition,
  canditSrc,
  canditDst
) {
  let pos = piece.currentSquare;
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
    let dst = pos + i * CONSTANTS.downLeft;
  /* eslint-disable */
    if (dst == kingPosition) {
      return false;
    }
    if (dst == canditSrc) {
      continue;
    } else if (dst == canditDst) {
      /* eslint-enable */
      break;
    } else if (squares[dst].piece !== null) {
      break;
    }
  }
  return allowed;
}

/*export function getCandidateQueenMoves(piece, squares) {
  let candidateMovesQueen = [];

  let candidateMovesBishop = getCandidateBishopMoves(piece, squares);
  let candidateMovesRook = getCandidateRookMoves(piece, squares);
  candidateMovesQueen = candidateMovesBishop.concat(candidateMovesRook);
  return candidateMovesQueen;
}*/

