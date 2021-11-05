import CONSTANTS from "../config/constants";

// 1. White candidate move 2. check all black next allowed moves to check the threats against white assuming this candidate move is played
// 3. sum threat scores (from those black allowed moves) against white piece (move) by piece
// 4. The lower the threat score is, the better for white 5. select the lowest black threat score against white

export function getBlackPawnThreatScore(piece, board) {
  const pos = piece.currentPieceSquare;
  const upLeft = pos + CONSTANTS.upLeft;
  const upRight = pos + CONSTANTS.upRight;
  let threatScore = 0;
  let leftValue = board[upLeft].piece.value;
  let rightValue = board[upRight].piece.value;

  if (board[upLeft].piece.white === true) {
    threatScore += leftValue;
  }
  if (board[upRight].piece.white === true) {
    threatScore += rightValue;
  }

  return threatScore;
}

export function getBlackQueenThreatScore(piece, board, squares) {
  let threatScore = 0;
  threatScore = getBlackBishopThreatScore(piece, board, squares);
  threatScore += getBlackRookThreatScore(piece, board, squares);
  return threatScore;
}

/**
 *
 * @param {*} piece
 * @param {*} board candidate board corresponding the game after white's candidate move
 */
export function getBlackKingThreatScore(piece, board) {
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

  if (board[UP].white === true) {
    threatScore += board[UP].piece.value;
  }
  if (board[DOWN].white === true) {
    threatScore += board[DOWN].piece.value;
  }
  if (board[LEFT].white === true) {
    threatScore += board[LEFT].piece.value;
  }
  if (board[RIGHT].white === true) {
    threatScore += board[RIGHT].piece.value;
  }
  if (board[DOWN_LEFT].white === true) {
    threatScore += board[DOWN_LEFT].piece.value;
  }
  if (board[DOWN_RIGHT].white === true) {
    threatScore += board[DOWN_RIGHT].piece.value;
  }
  if (board[UP_LEFT].white === true) {
    threatScore += board[UP_LEFT].piece.value;
  }
  if (board[UP_RIGHT].white === true) {
    threatScore += board[UP_RIGHT].piece.value;
  }
  return threatScore;
}

export function getBlackKnightThreatScore(piece, board) {
  const CURRENT_PIECE_SQUARE = piece.currentSquare;
  let threatScore = 0;

  const TWO_RIGHT_ONE_UP = CURRENT_PIECE_SQUARE + CONSTANTS.twoRightOneUp;

  if (board[TWO_RIGHT_ONE_UP].white === true) {
    // threat against white
    threatScore += board[TWO_RIGHT_ONE_UP].piece.value;
  }

  const TWO_RIGHT_ONE_DOWN = CURRENT_PIECE_SQUARE + CONSTANTS.twoRightOneDown;
  if (board[TWO_RIGHT_ONE_DOWN].white === true) {
    // threat against white
    threatScore += board[TWO_RIGHT_ONE_DOWN].piece.value;
  }
  const TWO_UP_ONE_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.twoUpOneRight;
  if (board[TWO_UP_ONE_RIGHT].white === true) {
    // threat against white
    threatScore += board[TWO_UP_ONE_RIGHT].piece.value;
  }

  const TWO_UP_ONE_LEFT = CURRENT_PIECE_SQUARE + CONSTANTS.twoUpOneLeft;

  if (board[TWO_UP_ONE_LEFT].white === true) {
    // threat against white
    threatScore += board[TWO_UP_ONE_LEFT].piece.value;
  }

  const TWO_LEFT_ONE_UP = CURRENT_PIECE_SQUARE + CONSTANTS.twoLeftOneUp;
  if (board[TWO_LEFT_ONE_UP].white === true) {
    // threat against white
    threatScore += board[TWO_LEFT_ONE_UP].piece.value;
  }

  const TWO_LEFT_ONE_DOWN = CURRENT_PIECE_SQUARE + CONSTANTS.twoLeftOneDown;
  if (board[TWO_LEFT_ONE_DOWN].white === true) {
    // threat against white
    threatScore += board[TWO_LEFT_ONE_DOWN].piece.value;
  }

  const TWO_DOWN_ONE_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.twoDownOneRight;
  if (board[TWO_DOWN_ONE_RIGHT].white === true) {
    // threat against white
    threatScore += board[TWO_DOWN_ONE_RIGHT].piece.value;
  }

  const TWO_DOWN_ONE_LEFT = CURRENT_PIECE_SQUARE + CONSTANTS.twoDownOneLeft;

  if (board[TWO_DOWN_ONE_LEFT].white === true) {
    // threat against white
    threatScore += board[TWO_DOWN_ONE_LEFT].piece.value;
  }

  return threatScore;
}

// initially only for threats against white
export function getBlackRookThreatScore(piece, board, squares) {
  let threatScore = 0;
  const pos = piece.currentPieceSquare;
  let UP = pos + CONSTANTS.up;
  let DOWN = pos + CONSTANTS.down;
  let LEFT = pos + CONSTANTS.left;
  let RIGHT = pos + CONSTANTS.right;

  // move UP
  for (let i = UP; i <= CONSTANTS.maxWhite; i += CONSTANTS.up) {
    let dst = pos + i * CONSTANTS.up;
    if (board[dst].piece === null) continue;

    if (board[dst].piece.white === true) {
      // get the threat score
      let value = board[dst].piece.value;
      threatScore += value;
      break; // end this row scanning
    }
  }

  // move DOWN
  for (let i = DOWN; i >= 0; i += CONSTANTS.down) {
    let dst = pos + i * CONSTANTS.down;
    if (board[dst].piece === null) continue;

    if (board[dst].piece.white === true) {
      // get the threat score
      let value = board[dst].piece.value;
      threatScore += value;
      break; // end this row scanning
    }
  }

  // move RIGHT
  let movesRight = CONSTANTS.maxCol - squares[pos].col;

  for (let i = RIGHT; i <= movesRight + pos; i++) {
    let dst = pos + i * CONSTANTS.right;
    if (board[dst].piece === null) continue;

    if (board[dst].piece.white === true) {
      // get the threat score
      let value = board[dst].piece.value;
      threatScore += value;
      break; // end this row scanning
    }
  }

  // move LEFT
  let movesLeft = squares[pos].col;

  for (let i = LEFT; i >= pos - movesLeft; i--) {
    let dst = pos + i * CONSTANTS.left;
    if (board[dst].piece === null) continue;

    if (board[dst].piece.white === true) {
      // get the threat score
      let value = board[dst].piece.value;
      threatScore += value;
      break; // end this row scanning
    }
  }

  return threatScore;
}

export function getBlackBishopThreatScore(piece, board, squares) {
  const currentPieceSquare = piece.currentSquare;

  const squaresAvailableRight =
    CONSTANTS.maxCol - board[currentPieceSquare].col;
  const squaresAvailableUp = CONSTANTS.maxRow - board[currentPieceSquare].row;
  const squaresAvailableLeft = squares[currentPieceSquare].col;

  let numberOfSquaresAvailable;
  let threatScore = 0;

  if (squaresAvailableRight <= squaresAvailableUp) {
    numberOfSquaresAvailable = squaresAvailableRight;
  } else {
    numberOfSquaresAvailable = squaresAvailableUp;
  }

  threatScore += getDiagonalThreatScoreAgainstWhite(
    board,
    piece,
    CONSTANTS.upRight,
    numberOfSquaresAvailable
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

  let squaresAvailableDown = squares[currentPieceSquare].row;

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
export function getTotalThreatScoreAgainstWhite(board) {
  let threatScore = 0;

  for (let i = 0; i <= CONSTANTS.whiteRightRookId; i++) {
    let piece = board[i].piece;

    if (piece === null || piece === undefined || piece.value > 0) {
      continue; // piece has been e.g. eaten or is a pawn
    }
    const value = piece.value;
    switch (value) {
      case CONSTANTS.BLACK_PAWN_CODE:
        threatScore += getBlackPawnThreatScore(piece);
        break;
      case CONSTANTS.BLACK_KNIGHT_CODE:
        threatScore += getBlackKnightThreatScore(piece);
        break;
      case CONSTANTS.BLACK_BISHOP_CODE:
        threatScore += getBlackBishopThreatScore(piece);
        break;
      case CONSTANTS.BLACK_ROOK_CODE:
        threatScore += getBlackRookThreatScore(piece);
        break;
      case CONSTANTS.BLACK_KING_CODE:
        threatScore += getBlackKingThreatScore(piece);
        break;
      case CONSTANTS.BLACK_QUEEN_CODE:
        threatScore += getBlackQueenThreatScore(piece);
        break;
      default:
        break;
    }
  }

  return threatScore;
}
