import CONSTANTS from "../config/constants";

// 1. White candidate move 2. check all black next allowed moves to check the threats against white assuming this candidate move is played
// 3. sum threat scores (from those black allowed moves) against white piece (move) by piece
// 4. The lower the threat score is, the better for white 5. select the lowest black threat score against white
/**
 * TODO: add threat from en passant
 * @param {*} piece 
 * @param {*} board 
 */
export function getWhitePawnThreatScoreAgainstMe(piece, board) {
  const pos = piece.currentSquare;
  let threatScore = 0;

  const downLeft = pos + CONSTANTS.downLeft;
  const downRight = pos + CONSTANTS.downRight;
  
  
  if (board[pos].col > 0 && board[downLeft].piece !== null && !board[downLeft].piece.white && board[downLeft] !== undefined) {    
    threatScore += board[downLeft].piece.value;
  }
  if (board[pos].col < 7 && board[downRight].piece !== null && board[downLeft] !== undefined && !board[downRight].piece.white) {
    threatScore += board[downRight].piece.value;
  }
  return threatScore;
}

/**
 * 
 * @param {*} piece 
 * @param {*} board 
 * @returns 
 */
export function getBlackPawnThreatScoreAgainstMe(piece, board) {
  const pos = piece.currentPieceSquare;
  const upLeft = pos + CONSTANTS.upLeft;
  const upRight = pos + CONSTANTS.upRight;

  let threatScore = 0;
  let leftValue = board[upLeft].piece.value;
  let rightValue = board[upRight].piece.value;

 // TODO: add same restrictions as with getWhitePawnThreatScoreAgainstMe(
  if (board[pos].col > 0 && board[upLeft].piece.white === true) {
    threatScore += leftValue;
  }
  if (board[pos].col < 7 && board[upRight].piece.white === true) {
    threatScore += rightValue;
  }

  return threatScore;
}


/**
 * 
 * @param {*} piece 
 * @param {*} board 
 * @param {*} white 
 * @returns 
 */
export function getQueenThreatScoreAgainstMe(piece, board, white) {
  let threatScore = 0;
  threatScore = getBishopThreatScoreAgainstMe(piece, board, white);
  threatScore += getRookThreatScoreAgainstMe(piece, board, white);
  return threatScore;
}

/**
 *
 * @param {*} piece
 * @param {*} board candidate board corresponding the game after white's candidate move
 */
export function getKingThreatScoreAgainstMe(piece, board, white) {
  let threatScore = 0;

  const currentPieceSquareNumber = piece.currentSquare; // ensure this is dealt as an integer!
  const UP = currentPieceSquareNumber + CONSTANTS.up;
  const DOWN = currentPieceSquareNumber + CONSTANTS.down;
  const LEFT = currentPieceSquareNumber + CONSTANTS.left;
  const RIGHT = currentPieceSquareNumber + CONSTANTS.right;
  const DOWN_LEFT = currentPieceSquareNumber + CONSTANTS.downLeft;
  const DOWN_RIGHT = currentPieceSquareNumber + CONSTANTS.downRight;
  const UP_LEFT = currentPieceSquareNumber + CONSTANTS.upLeft;
  const UP_RIGHT = currentPieceSquareNumber + CONSTANTS.upRight;

  if (
    board[UP] !== undefined &&
    board[UP].piece !== null     
  ) {
    if (white && board[UP].piece.white) {
      threatScore += board[UP].piece.value;
    } else if (!white && !board[UP].piece.white) {
      threatScore += Math.abs(board[UP].piece.value);
    }
  }
  if (
    board[DOWN] !== undefined &&
    board[DOWN].piece !== null     
  ) {
    if (white && board[DOWN].piece.white) {
      threatScore += board[DOWN].piece.value;
    } else if (!white && !board[DOWN].piece.white) {
      threatScore += Math.abs(board[DOWN].piece.value);
    }
    
  }
  if (
    board[LEFT] !== undefined &&
    board[LEFT].piece !== null    
  ) {
    if (white && board[LEFT].piece.white) {
      threatScore += board[LEFT].piece.value;
    } else if (!white && !board[LEFT].piece.white) {
      threatScore += Math.abs(board[LEFT].piece.value);
    }    
  }
  if (
    board[RIGHT] !== undefined &&
    board[RIGHT].piece !== null     
  ) {
    if (white && board[RIGHT].piece.white) {
      threatScore += board[RIGHT].piece.value;
    } else if (!white && !board[RIGHT].piece.white) {
      threatScore += Math.abs(board[RIGHT].piece.value);
    }
    
  }
  if (
    board[DOWN_LEFT] !== undefined &&
    board[DOWN_LEFT].piece !== null     
  ) {
    if (white && board[DOWN_LEFT].piece.white) {
      threatScore += board[DOWN_LEFT].piece.value;
    } else if (!white && !board[DOWN_LEFT].piece.value) {
      threatScore += Math.abs(board[DOWN_LEFT].piece.value);

    }
    
  }
  if (
    board[DOWN_RIGHT] !== undefined &&
    board[DOWN_RIGHT].piece !== null     
  ) {
    if (white && board[DOWN_RIGHT].piece.white) {
      threatScore += board[DOWN_RIGHT].piece.value;
    } else if (!white && !board[DOWN_RIGHT].piece.white) {
      threatScore += Math.abs(board[DOWN_RIGHT].piece.value);
    }
    
  }
  if (
    board[UP_LEFT] !== undefined &&
    board[UP_LEFT].piece !== null     
  ) {
    if (white && board[UP_LEFT].piece.white) {
      threatScore += board[UP_LEFT].piece.value;
    } else if (!white && !board[UP_LEFT].piece.white) {
      threatScore += Math.abs(board[UP_LEFT].piece.value);
    }
    
  }
  if (
    board[UP_RIGHT] !== undefined &&
    board[UP_RIGHT].piece !== null     
  ) {
    if (white && board[UP_RIGHT].piece.white) {
      threatScore += board[UP_RIGHT].piece.value;
    } else if  (!white && !board[UP_RIGHT].piece.white) {
      threatScore += Math.abs(board[UP_RIGHT].piece.value);
    }    
  }
  return threatScore;
}

/**
 *
 * @param {*} piece my piece
 * @param {*} board candidate board
 * @param {*} white true if I'm white, false otherwise
 * @returns
 */
export function getKnightThreatScoreAgainstMe(piece, board, white) {
  const CURRENT_PIECE_SQUARE = piece.currentSquare;
  let threatScore = 0;

  if (
    board[CURRENT_PIECE_SQUARE].row <= 6 &&
    board[CURRENT_PIECE_SQUARE].col <= 5
  ) {
    const TWO_RIGHT_ONE_UP = CURRENT_PIECE_SQUARE + CONSTANTS.twoRightOneUp;
    if (
      board[TWO_RIGHT_ONE_UP] !== undefined &&
      board[TWO_RIGHT_ONE_UP].piece !== null
    ) {
      if (white && board[TWO_RIGHT_ONE_UP].piece.white === true) {
        threatScore += board[TWO_RIGHT_ONE_UP].piece.value; // threat against white
      } else if (!white && board[TWO_RIGHT_ONE_UP].piece.white === false) {
        threatScore += Math.abs(board[TWO_RIGHT_ONE_UP].piece.value);
      }
    }
  }

  if (
    board[CURRENT_PIECE_SQUARE].row >= 1 &&
    board[CURRENT_PIECE_SQUARE].col <= 5
  ) {
    const TWO_RIGHT_ONE_DOWN = CURRENT_PIECE_SQUARE + CONSTANTS.twoRightOneDown;
    if (
      board[TWO_RIGHT_ONE_DOWN] !== undefined &&
      board[TWO_RIGHT_ONE_DOWN].piece !== null
    ) {
      if (white && board[TWO_RIGHT_ONE_DOWN].white === true) {
        // threat against white
        threatScore += board[TWO_RIGHT_ONE_DOWN].piece.value;
      } else if (!white && board[TWO_RIGHT_ONE_DOWN].white === false) {
        threatScore += Math.abs(board[TWO_RIGHT_ONE_DOWN].piece.value);
      }
    }
  }

  if (
    board[CURRENT_PIECE_SQUARE].row <= 5 &&
    board[CURRENT_PIECE_SQUARE].col <= 6
  ) {
    const TWO_UP_ONE_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.twoUpOneRight;
    if (
      board[TWO_UP_ONE_RIGHT] !== undefined &&
      board[TWO_UP_ONE_RIGHT].piece !== null
    ) {
      if (white && board[TWO_UP_ONE_RIGHT].piece.white) {
        // threat against white
        threatScore += board[TWO_UP_ONE_RIGHT].piece.value;
      } else if (!white && !board[TWO_UP_ONE_RIGHT].piece.white) {
        threatScore += Math.abs(board[TWO_UP_ONE_RIGHT].piece.value);
      }
    }
  }

  if (
    board[CURRENT_PIECE_SQUARE].row <= 5 &&
    board[CURRENT_PIECE_SQUARE].col >= 1
  ) {
    const TWO_UP_ONE_LEFT = CURRENT_PIECE_SQUARE + CONSTANTS.twoUpOneLeft;

    if (
      board[TWO_UP_ONE_LEFT] !== undefined &&
      board[TWO_UP_ONE_LEFT].piece !== null
    ) {
      if (white && board[TWO_UP_ONE_LEFT].piece.white) {
        // threat against white

        threatScore += board[TWO_UP_ONE_LEFT].piece.value;
      } else if (!white && !board[TWO_UP_ONE_LEFT].piece.white) {
        threatScore += Math.abs(board[TWO_UP_ONE_LEFT].piece.value);
      }
    }
  }

  if (
    board[CURRENT_PIECE_SQUARE].row <= 6 &&
    board[CURRENT_PIECE_SQUARE].col >= 2
  ) {
    const TWO_LEFT_ONE_UP = CURRENT_PIECE_SQUARE + CONSTANTS.twoLeftOneUp;
    if (
      board[TWO_LEFT_ONE_UP] !== undefined &&
      board[TWO_LEFT_ONE_UP].piece !== null
    ) {
      if (white && board[TWO_LEFT_ONE_UP].piece.white) {
        // threat against white

        threatScore += board[TWO_LEFT_ONE_UP].piece.value;
      } else if (!white && !board[TWO_LEFT_ONE_UP].piece.white) {
        threatScore += Math.abs(board[TWO_LEFT_ONE_UP].piece.value);
      }
    }
  }

  if (
    board[CURRENT_PIECE_SQUARE].row >= 1 &&
    board[CURRENT_PIECE_SQUARE].col >= 2
  ) {
    const TWO_LEFT_ONE_DOWN = CURRENT_PIECE_SQUARE + CONSTANTS.twoLeftOneDown;
    if (
      board[TWO_LEFT_ONE_DOWN] !== undefined &&
      board[TWO_LEFT_ONE_DOWN].piece !== null
    ) {
      if (white && board[TWO_LEFT_ONE_DOWN].piece.white) {
        // threat against white
        threatScore += board[TWO_LEFT_ONE_DOWN].piece.value;
      } else if (!white && !board[TWO_LEFT_ONE_DOWN].piece.white) {
        threatScore += Math.abs(board[TWO_LEFT_ONE_DOWN].piece.value);
      }
    }
  }
  if (
    board[CURRENT_PIECE_SQUARE].row >= 2 &&
    board[CURRENT_PIECE_SQUARE].col <= 6
  ) {
    const TWO_DOWN_ONE_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.twoDownOneRight;
    if (
      board[TWO_DOWN_ONE_RIGHT] !== undefined &&
      board[TWO_DOWN_ONE_RIGHT].piece !== null
    ) {
      if (white && board[TWO_DOWN_ONE_RIGHT].piece.white) {
        // threat against white
        threatScore += board[TWO_DOWN_ONE_RIGHT].piece.value;
      } else if (!white && !board[TWO_DOWN_ONE_RIGHT].piece.white) {
        // threat against white
        threatScore += Math.abs(board[TWO_DOWN_ONE_RIGHT].piece.value);
      }
    }
  }

  if (
    board[CURRENT_PIECE_SQUARE].row >= 2 &&
    board[CURRENT_PIECE_SQUARE].col >= 1
  ) {
    const TWO_DOWN_ONE_LEFT = CURRENT_PIECE_SQUARE + CONSTANTS.twoDownOneLeft;

    if (
      board[TWO_DOWN_ONE_LEFT] !== undefined &&
      board[TWO_DOWN_ONE_LEFT].piece !== null &&
      board[TWO_DOWN_ONE_LEFT].piece.white === true
    ) {
      if (white && board[TWO_DOWN_ONE_LEFT].piece.white) {
        // threat against white
        threatScore += board[TWO_DOWN_ONE_LEFT].piece.value;
      } else if (!white && !board[TWO_DOWN_ONE_LEFT].piece.white) {
        // threat against white
        threatScore += Math.abs(board[TWO_DOWN_ONE_LEFT].piece.value);
      }
    }
  }

  return threatScore;
}

/**
 *
 * @param {*} piece my piece under threat
 * @param {*} board the candidate board
 * @param {*} white my color under threat
 * @returns
 */
export function getRookThreatScoreAgainstMe(piece, board, white) {
  let threatScore = 0;
  let pos = piece.currentSquare;

  let UP = pos + CONSTANTS.up;
  let DOWN = pos + CONSTANTS.down;
  let LEFT = pos + CONSTANTS.left;
  let RIGHT = pos + CONSTANTS.right;

  // move UP
  for (let i = UP; i <= CONSTANTS.maxWhite; i += CONSTANTS.up) {
    if (board[i] === undefined || board[i].piece === null) continue;

    if (white && board[i].piece.white === true) {
      // get the threat score
      let value = board[i].piece.value;
      threatScore += value;
      break; // end this row scanning
    } else if (!white && board[i].piece.white === false) {
      let value = Math.abs(board[i].piece.value);
      threatScore += value;
      break;
    }
  }

  // move DOWN
  for (let i = DOWN; i >= 0; i += CONSTANTS.down) {
    if (board[i] === undefined || board[i].piece === null) continue;

    if (white && board[i].piece.white === true) {
      // get the threat score
      let value = board[i].piece.value;
      threatScore += value;
      break; // end this row scanning
    } else if (!white && board[i].piece.white === false) {
      let value = Math.abs(board[i].piece.value);
      threatScore += value;
      break;
    }
  }

  // move RIGHT

  let movesRight = CONSTANTS.maxCol - board[pos].col;

  for (let i = RIGHT; i <= movesRight + pos; i++) {
    if (board[i] === undefined || board[i].piece === null) continue;

    if (white && board[i].piece.white === true) {
      // get the threat score
      let value = board[i].piece.value;
      threatScore += value;
      break; // end this row scanning
    } else if (!white && board[i].piece.white === false) {
      let value = Math.abs(board[i].piece.value);
      threatScore += value;
      break;
    }
  }

  // move LEFT
  let movesLeft = board[pos].col;

  for (let i = LEFT; i >= pos - movesLeft; i--) {
    if (board[i] === undefined || board[i].piece === null) continue;

    if (white && board[i].piece.white === true) {
      // get the threat score
      let value = board[i].piece.value;
      threatScore += value;
      break; // end this row scanning
    } else if (!white && board[i].piece.white === false) {
      let value = Math.abs(board[i].piece.value);
      threatScore += value;
      break;
    }
  }

  return threatScore;
}

/**
 *
 * @param {*} piece my piece
 * @param {*} board candidate board
 * @param {*} white my color
 * @returns
 */
export function getBishopThreatScoreAgainstMe(piece, board, white) {
  const currentPieceSquare = piece.currentSquare;

  const squaresAvailableRight =
    CONSTANTS.maxCol - board[currentPieceSquare].col;
  const squaresAvailableUp = CONSTANTS.maxRow - board[currentPieceSquare].row;

  const squaresAvailableLeft = board[currentPieceSquare].col;

  let numberOfSquaresAvailable;
  let threatScore = 0;

  if (squaresAvailableRight <= squaresAvailableUp) {
    numberOfSquaresAvailable = squaresAvailableRight;
  } else {
    numberOfSquaresAvailable = squaresAvailableUp;
  }

  threatScore += getDiagonalThreatScoreAgainst(
    board,
    piece,
    CONSTANTS.upRight,
    numberOfSquaresAvailable,
    white
  ); // upRight

  if (squaresAvailableLeft <= squaresAvailableUp) {
    numberOfSquaresAvailable = squaresAvailableLeft;
  } else {
    numberOfSquaresAvailable = squaresAvailableUp;
  }

  threatScore += getDiagonalThreatScoreAgainstWhite(
    board,
    piece,
    CONSTANTS.upLeft,
    numberOfSquaresAvailable
  ); // upLeft

  let squaresAvailableDown = board[currentPieceSquare].row;

  if (squaresAvailableRight <= squaresAvailableDown) {
    numberOfSquaresAvailable = squaresAvailableRight;
  } else {
    numberOfSquaresAvailable = squaresAvailableDown;
  }

  threatScore += getDiagonalThreatScoreAgainstWhite(
    board,
    piece,
    CONSTANTS.downRight,
    numberOfSquaresAvailable
  ); // downRight

  if (squaresAvailableLeft <= squaresAvailableDown) {
    numberOfSquaresAvailable = squaresAvailableLeft;
  } else {
    numberOfSquaresAvailable = squaresAvailableDown;
  }

  threatScore += getDiagonalThreatScoreAgainstWhite(
    board,
    piece,
    CONSTANTS.downLeft,
    numberOfSquaresAvailable
  ); // downLeft
  return threatScore;
}

export function getDiagonalThreatScoreAgainst(
  board,
  piece,
  diagonal,
  numberOfSquaresAvailable,
  white
) {
  const currentPieceSquare = piece.currentSquare;
  let threatScore = 0;

  for (let i = 1; i <= numberOfSquaresAvailable; i++) {
    // upleft
    let dst = currentPieceSquare + i * diagonal;

    if (board[dst].piece === null) continue;

    if (white && board[dst].piece.white === true) {
      // get the threat score
      let value = board[dst].piece.value;
      threatScore += value;
      break; // end this diagonal scanning
    } else if (!white && board[dst].piece.white === false) {
      let value = board[dst].piece.value;
      threatScore += Math.abs(value); // avoid negative threat score against black
      break; // end this diagonal scanning
    }
  }

  return threatScore;
}

/**
 *
 * @param {*} board candidate board corresponding the white candidate move
 * @param {*} piece
 * @param {*} diagonal upright, downright, upleft, downleft
 * @param {*} numberOfSquaresAvailable
 */
export function getDiagonalThreatScoreAgainstWhite(
  board,
  piece,
  diagonal,
  numberOfSquaresAvailable
) {
  const currentPieceSquare = piece.currentSquare;

  let threatScore = 0;

  for (let i = 1; i <= numberOfSquaresAvailable; i++) {
    // upleft
    let dst = currentPieceSquare + i * diagonal;

    if (board[dst].piece === null) continue;

    if (board[dst].piece.white === true) {
      // get the threat score
      let value = board[dst].piece.value;
      threatScore += value;
      break; // end this diagonal scanning
    }
  }
  return threatScore;
}

// returns the threat score that this piece causes threat to the opponent
// e.g. if a black pawn threats both white pawn and white knight, the threat score will be 1 + 3 = 4
/**
 *
 * @param {*} board candidate board
 * @param {*} white my color
 * @returns
 */
export function getTotalThreatScoreAgainstWhite(board) {
  let threatScore = 0;

  for (let i = 0; i <= CONSTANTS.whiteRightRookId; i++) {
    let piece = board[i].piece;

    if (piece === null || piece === undefined || piece.value > 0) {
      continue; 
    }
    const value = piece.value;
    //console.log("piece value = " + value);
    switch (value) {
      case CONSTANTS.BLACK_PAWN_CODE:
        threatScore += getBlackPawnThreatScoreAgainstMe(piece, board);
        break;
      case CONSTANTS.BLACK_KNIGHT_CODE:
        threatScore += getKnightThreatScoreAgainstMe(piece, board, true);
        break;
      case CONSTANTS.BLACK_BISHOP_CODE:
        threatScore += getBishopThreatScoreAgainstMe(piece, board, true);
        break;
      case CONSTANTS.BLACK_ROOK_CODE:
        threatScore += getRookThreatScoreAgainstMe(piece, board, true);
        break;
      case CONSTANTS.BLACK_KING_CODE:
        threatScore += getKingThreatScoreAgainstMe(piece, board, true);
        break;
      case CONSTANTS.BLACK_QUEEN_CODE:
        threatScore += getQueenThreatScoreAgainstMe(piece, board, true);
        break;
      default:
        break;
    }
  }
  return threatScore;
}
export function getTotalThreatScoreAgainstBlack(board) {
  let threatScore = 0;

  for (let i = 0; i <= CONSTANTS.whiteRightRookId; i++) {
    let piece = board[i].piece;

    if (piece === null || piece === undefined || piece.value < 0) {
      continue; // piece has been e.g. eaten 
    }
    const value = piece.value;
    //console.log("piece value = " + value);
    // TODO: add parametrized threatscore functions
    switch (value) {
      case CONSTANTS.WHITE_PAWN_CODE:
        threatScore += getWhitePawnThreatScoreAgainstMe(piece, board);
        break;
      case CONSTANTS.WHITE_KNIGHT_CODE:
        threatScore += getKnightThreatScoreAgainstMe(piece, board, false);
        break;
      case CONSTANTS.WHITE_BISHOP_CODE:
        threatScore += getBishopThreatScoreAgainstMe(piece, board, false);
        break;
      case CONSTANTS.WHITE_ROOK_CODE:
        threatScore += getRookThreatScoreAgainstMe(piece, board, false);
        break;
      case CONSTANTS.WHITE_KING_CODE:
        threatScore += getKingThreatScoreAgainstMe(piece, board, false);
        break;
      case CONSTANTS.WHITE_QUEEN_CODE:
        threatScore += getQueenThreatScoreAgainstMe(piece, board, false);
        break;
      default:
        break;
    }
  }
  return threatScore;
}
