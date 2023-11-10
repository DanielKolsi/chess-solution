import CONSTANTS from "../config/constants";


/**
 *
 * @param {*} piece
 * @param {*} board
 */
export function getCandidateKingMoves(piece, board, canCaptureWhite) {
  let candidateMoves = [];

  const DEFAULT_DELIM = CONSTANTS.defaultDelim;
  const currentPieceSquareNumber = piece.currentSquare; // ensure this is dealt as an integer!

  const UP = currentPieceSquareNumber + CONSTANTS.up;
  const DOWN = currentPieceSquareNumber + CONSTANTS.down;
  const LEFT = currentPieceSquareNumber + CONSTANTS.left;
  const RIGHT = currentPieceSquareNumber + CONSTANTS.right;
  const DOWN_LEFT = currentPieceSquareNumber + CONSTANTS.downLeft;
  const DOWN_RIGHT = currentPieceSquareNumber + CONSTANTS.downRight;
  const UP_LEFT = currentPieceSquareNumber + CONSTANTS.upLeft;
  const UP_RIGHT = currentPieceSquareNumber + CONSTANTS.upRight;

  // needs to stay on the board limits

  if (
    board[currentPieceSquareNumber].row < CONSTANTS.maxRow &&
    (board[UP].piece == null || board[UP].piece.white === canCaptureWhite)
  ) {
    candidateMoves.push(currentPieceSquareNumber + DEFAULT_DELIM + UP);
  }
  if (
    board[currentPieceSquareNumber].row > CONSTANTS.minRow &&
    (board[DOWN].piece == null || board[DOWN].piece.white === canCaptureWhite)
  ) {
    candidateMoves.push(currentPieceSquareNumber + DEFAULT_DELIM + DOWN);
  }

  if (
    board[currentPieceSquareNumber].col > CONSTANTS.minCol &&
    (board[LEFT].piece == null || board[LEFT].piece.white === canCaptureWhite)
  ) {
    candidateMoves.push(currentPieceSquareNumber + DEFAULT_DELIM + LEFT);
  }

  if (
    board[currentPieceSquareNumber].col < CONSTANTS.maxCol &&
    (board[RIGHT].piece == null || board[RIGHT].piece.white === canCaptureWhite)
  ) {
    candidateMoves.push(currentPieceSquareNumber + DEFAULT_DELIM + RIGHT);
  }

  if (
    board[currentPieceSquareNumber].row < CONSTANTS.maxRow &&
    board[currentPieceSquareNumber].col < CONSTANTS.maxCol
  ) {
    if (
      board[UP_RIGHT].piece == null ||
      board[UP_RIGHT].piece.white === canCaptureWhite
    ) {
      candidateMoves.push(currentPieceSquareNumber + DEFAULT_DELIM + UP_RIGHT);
    }
  }

  if (
    board[currentPieceSquareNumber].row > CONSTANTS.minRow &&
    board[currentPieceSquareNumber].col < CONSTANTS.maxCol
  ) {
    if (
      board[DOWN_RIGHT].piece == null ||
      board[DOWN_RIGHT].piece.white === canCaptureWhite
    ) {
      candidateMoves.push(
        currentPieceSquareNumber + DEFAULT_DELIM + DOWN_RIGHT
      );
    }
  }

  if (
    board[currentPieceSquareNumber].row < CONSTANTS.maxRow &&
    board[currentPieceSquareNumber].col > CONSTANTS.minCol
  ) {
    if (
      board[UP_LEFT].piece == null ||
      board[UP_LEFT].piece.white === canCaptureWhite
    ) {
      candidateMoves.push(currentPieceSquareNumber + DEFAULT_DELIM + UP_LEFT);
    }
  }

  if (
    board[currentPieceSquareNumber].row > CONSTANTS.minRow &&
    board[currentPieceSquareNumber].col > CONSTANTS.minCol
  ) {
    if (
      board[DOWN_LEFT].piece == null ||
      board[DOWN_LEFT].piece.white === canCaptureWhite
    ) {
      candidateMoves.push(currentPieceSquareNumber + DEFAULT_DELIM + DOWN_LEFT);
    }
  }
  return candidateMoves;
}

/**
 *
 * @param {*} piece
 * @param {*} board
 * @param {*} prevMove
 * @returns
 */
export function getCandidateWhitePawnMoves(piece, board, prevMove) {
  const CURRENT_PIECE_SQUARE = piece.currentSquare;

  const DELIMITER = CONSTANTS.defaultDelim;
  const DOWN = CURRENT_PIECE_SQUARE + CONSTANTS.down;
  const DOWN2 = CURRENT_PIECE_SQUARE + CONSTANTS.down2;
  const DOWN_LEFT = CURRENT_PIECE_SQUARE + CONSTANTS.downLeft;
  const DOWN_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.downRight;

  let candidateMoves = [];

  if (DOWN < 0 || DOWN_RIGHT < 0 || DOWN_LEFT < 0) return candidateMoves;
  if (board[DOWN].piece === null && DOWN <= 7) {
    // promotion -> DOWN & DOWNLEFT & DOWNRIGHT
    addWhitePromotion(candidateMoves, CURRENT_PIECE_SQUARE, DOWN);
  } else if (
    DOWN_RIGHT <= 7 &&
    board[DOWN_RIGHT].piece !== null &&
    board[DOWN_RIGHT].piece.white === false
  ) {
    // promotion by eating
    addWhitePromotion(candidateMoves, CURRENT_PIECE_SQUARE, DOWN_RIGHT);
  } else if (
    DOWN_LEFT <= 7 &&
    board[DOWN_LEFT].piece !== null &&
    board[DOWN_LEFT].piece.white === false
  ) {
    addWhitePromotion(candidateMoves, CURRENT_PIECE_SQUARE, DOWN_LEFT);
  } else if (
    board[DOWN].piece === null &&
    board[CURRENT_PIECE_SQUARE].row > CONSTANTS.minRow
  ) {
    candidateMoves.push(CURRENT_PIECE_SQUARE + DELIMITER + DOWN);

    if (
      board[CURRENT_PIECE_SQUARE].row === CONSTANTS.whitePawnInitialRow &&
      board[DOWN2].piece === null
    ) {
      // hasn't moved yet, double pawn front
      candidateMoves.push(CURRENT_PIECE_SQUARE + DELIMITER + DOWN2);
    }
  }

  if (
    board[CURRENT_PIECE_SQUARE].col > CONSTANTS.minCol &&
    board[DOWN_LEFT].piece !== null &&
    board[DOWN_LEFT].piece.white === false
  ) {
    const move = CURRENT_PIECE_SQUARE + DELIMITER + DOWN_LEFT; 
    candidateMoves.push(move); // eats black piece
  } 
  if (
    board[CURRENT_PIECE_SQUARE].col < CONSTANTS.maxCol &&
    board[DOWN_RIGHT].piece !== null &&
    board[DOWN_RIGHT].piece.white === false
  ) {
    candidateMoves.push(CURRENT_PIECE_SQUARE + DELIMITER + DOWN_RIGHT); // eats black piece
  }

  if (
    board[CURRENT_PIECE_SQUARE].row ===
    CONSTANTS.whitePawnInThisRowCanCaptureWithEnPassant
  ) {
    const RIGHT_PIECE = board[CURRENT_PIECE_SQUARE + CONSTANTS.right].piece;
    const LEFT_PIECE = board[CURRENT_PIECE_SQUARE + CONSTANTS.left].piece;

    if (
      RIGHT_PIECE !== null &&
      RIGHT_PIECE.value === CONSTANTS.BLACK_PAWN_CODE
    ) {
      const DST = CURRENT_PIECE_SQUARE + CONSTANTS.right;
      const SRC = DST + CONSTANTS.down2;
      const PREVIOUS_BLACK_PAWN_MOVE = SRC + DELIMITER + DST;

      if (prevMove === PREVIOUS_BLACK_PAWN_MOVE) {
        // en passant
        const DOWN_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.downRight;
        candidateMoves.push(
          CURRENT_PIECE_SQUARE + CONSTANTS.EN_PASSANT + DOWN_RIGHT
        );
      }
    } else if (
      LEFT_PIECE !== null &&
      LEFT_PIECE.value === CONSTANTS.BLACK_PAWN_CODE
    ) {
      const dst = CURRENT_PIECE_SQUARE + CONSTANTS.left;
      const src = dst + CONSTANTS.down2;
      const tmp = src + DELIMITER + dst;

      if (prevMove === tmp) {
        const downLeft = CURRENT_PIECE_SQUARE + CONSTANTS.downLeft;
        candidateMoves.push(
          CURRENT_PIECE_SQUARE + CONSTANTS.EN_PASSANT + downLeft
        ); // en passe black pawn; P for en passe
      }
    }
  }
  return candidateMoves;
}

/**
 *
 * @param {*} candidateMoves
 * @param {*} currentSquare
 * @param {*} promotionDirection
 */
export function addWhitePromotion(
  candidateMoves,
  currentSquare,
  promotionDirection
) {
  candidateMoves.push(
    currentSquare + CONSTANTS.PROMOTION_TO_QUEEN + promotionDirection
  );
  candidateMoves.push(
    currentSquare + CONSTANTS.PROMOTION_TO_ROOK + promotionDirection
  ); // underpromotion to rook
  candidateMoves.push(
    currentSquare + CONSTANTS.PROMOTION_TO_BISHOP + promotionDirection
  ); // underpromotion to bishop
  candidateMoves.push(
    currentSquare + CONSTANTS.PROMOTION_TO_KNIGHT + promotionDirection
  ); // underpromotion to knight
}

/**
 *
 * @param {*} piece
 * @param {*} board
 * @param {*} prevMove
 * @returns
 */
export function getCandidateBlackPawnMoves(piece, board, prevMove) {
  const DELIMITER = CONSTANTS.defaultDelim;
  const currentPieceSquare = piece.currentSquare; // ensure this is a number

  let up = currentPieceSquare + CONSTANTS.up;
  let up2 = currentPieceSquare + CONSTANTS.up2;
  let upLeft = currentPieceSquare + CONSTANTS.upLeft;
  let upRight = currentPieceSquare + CONSTANTS.upRight;

  let candidateMoves = [];

  if (
    board[up].piece === null &&
    board[currentPieceSquare].row < CONSTANTS.maxRow
  ) {
    candidateMoves.push(currentPieceSquare + DELIMITER + up); // one up

    if (
      board[currentPieceSquare].row === CONSTANTS.blackPawnInitialRow &&
      board[up2].piece === null
    ) {
      // hasn't moved yet, double pawn front
      candidateMoves.push(currentPieceSquare + DELIMITER + up2);
    }
  }
  if (
    board[currentPieceSquare].col > CONSTANTS.minCol &&
    board[upLeft].piece !== null &&
    board[upLeft].piece.white === true
  ) {
    // eat white
    candidateMoves.push(currentPieceSquare + DELIMITER + upLeft);
  }
  if (
    board[currentPieceSquare].col < CONSTANTS.maxCol &&
    board[upRight].piece !== null &&
    board[upRight].piece.white === true
  ) {
    // right up eat white
    candidateMoves.push(currentPieceSquare + DELIMITER + upRight);
  }

  if (
    board[currentPieceSquare].row ===
    CONSTANTS.blackPawnInThisRowCanCaptureWithEnPassant
  ) {
    const rightPiece = board[currentPieceSquare + CONSTANTS.right].piece;
    const leftPiece = board[currentPieceSquare + CONSTANTS.left].piece;

    if (rightPiece !== null && rightPiece.value === CONSTANTS.WHITE_PA) {
      const dst = currentPieceSquare + CONSTANTS.right;
      const src = dst + CONSTANTS.up2;
      const previousWhitePawnMove = src + DELIMITER + dst;

      if (prevMove === previousWhitePawnMove) {
        const upRight = currentPieceSquare + CONSTANTS.upRight;
        candidateMoves.push(
          currentPieceSquare + CONSTANTS.EN_PASSANT + upRight
        );
        console.error("en passant check allowed...");
      }
    } else if (
      leftPiece !== null &&
      leftPiece.value === CONSTANTS.WHITE_PAWN_CODE
    ) {
      const dst = currentPieceSquare + CONSTANTS.left;
      const src = dst + CONSTANTS.up2;
      const tmp = src + DELIMITER + dst;

      if (prevMove === tmp) {
        const upLeft = currentPieceSquare + CONSTANTS.upLeft;
        candidateMoves.push(currentPieceSquare + CONSTANTS.EN_PASSANT + upLeft); // en passe black pawn; P for en passe
      }
    }
  }
  return candidateMoves;
}

/**
 *
 * @param {*} piece
 * @param {*} board
 * @returns
 */
export function getCandidateKnightMoves(piece, board) {
  const CURRENT_PIECE_SQUARE = piece.currentSquare;
  const DLM = CONSTANTS.defaultDelim;
  const CHECK = CONSTANTS.CHECK;

  const TWO_RIGHT_ONE_UP = CURRENT_PIECE_SQUARE + CONSTANTS.twoRightOneUp;
  const TWO_RIGHT_ONE_DOWN = CURRENT_PIECE_SQUARE + CONSTANTS.twoRightOneDown;
  const TWO_UP_ONE_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.twoUpOneRight;
  const TWO_UP_ONE_LEFT = CURRENT_PIECE_SQUARE + CONSTANTS.twoUpOneLeft;
  const TWO_LEFT_ONE_UP = CURRENT_PIECE_SQUARE + CONSTANTS.twoLeftOneUp;
  const TWO_LEFT_ONE_DOWN = CURRENT_PIECE_SQUARE + CONSTANTS.twoLeftOneDown;
  const TWO_DOWN_ONE_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.twoDownOneRight;
  const TWO_DOWN_ONE_LEFT = CURRENT_PIECE_SQUARE + CONSTANTS.twoDownOneLeft;

  let candidateMoves = [];

  if (
    board[CURRENT_PIECE_SQUARE].row <= 6 &&
    board[CURRENT_PIECE_SQUARE].col <= 5
  ) {
    // check that the move stays on the board
    if (
      board[TWO_RIGHT_ONE_UP].piece === null ||
      board[TWO_RIGHT_ONE_UP].piece.white !== piece.white
    ) {
      if (
        board[TWO_RIGHT_ONE_UP].piece !== null &&
        ((piece.white &&
          board[TWO_RIGHT_ONE_UP].piece.value === CONSTANTS.BLACK_KING_CODE) ||
          (!piece.white &&
            board[TWO_RIGHT_ONE_UP].piece.value === CONSTANTS.WHITE_KING_CODE))
      ) {
        candidateMoves.push(CURRENT_PIECE_SQUARE + CHECK + TWO_RIGHT_ONE_UP);
        //console.error("CHECK DETECTED!!");
      } else {
        candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_RIGHT_ONE_UP);
      }
    }
  }

  // 2 right, 1 down
  if (
    board[CURRENT_PIECE_SQUARE].row >= 1 &&
    board[CURRENT_PIECE_SQUARE].col <= 5
  ) {
    // check that the move stays on the board

    if (
      board[TWO_RIGHT_ONE_DOWN].piece === null ||
      board[TWO_RIGHT_ONE_DOWN].piece.white !== piece.white
    ) {
      if (
        board[TWO_RIGHT_ONE_DOWN].piece !== null &&
        ((piece.white && board[TWO_RIGHT_ONE_DOWN].piece.value === -6) ||
          (!piece.white && board[TWO_RIGHT_ONE_DOWN].piece.value === 6))
      ) {
        candidateMoves.push(CURRENT_PIECE_SQUARE + CHECK + TWO_RIGHT_ONE_DOWN);
      } else {
        candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_RIGHT_ONE_DOWN);
      }
    }
  }

  // 2 up, 1 right

  if (
    board[CURRENT_PIECE_SQUARE].row <= 5 &&
    board[CURRENT_PIECE_SQUARE].col <= 6
  ) {
    if (
      board[TWO_UP_ONE_RIGHT].piece === null ||
      board[TWO_UP_ONE_RIGHT].piece.white !== piece.white
    ) {
      candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_UP_ONE_RIGHT);
    }
  }

  if (
    board[CURRENT_PIECE_SQUARE].row <= 5 &&
    board[CURRENT_PIECE_SQUARE].col >= 1
  ) {
    if (
      board[TWO_UP_ONE_LEFT].piece === null ||
      board[TWO_UP_ONE_LEFT].piece.white !== piece.white
    ) {
      candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_UP_ONE_LEFT);
    }
  }

  if (
    board[CURRENT_PIECE_SQUARE].row <= 6 &&
    board[CURRENT_PIECE_SQUARE].col >= 2
  ) {
    if (
      board[TWO_LEFT_ONE_UP].piece === null ||
      board[TWO_LEFT_ONE_UP].piece.white !== piece.white
    ) {
      candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_LEFT_ONE_UP);
    }
  }

  if (
    board[CURRENT_PIECE_SQUARE].row >= 1 &&
    board[CURRENT_PIECE_SQUARE].col >= 2
  ) {
    if (
      board[TWO_LEFT_ONE_DOWN].piece === null ||
      board[TWO_LEFT_ONE_DOWN].piece.white !== piece.white
    ) {
      candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_LEFT_ONE_DOWN);
    }
  }

  if (
    board[CURRENT_PIECE_SQUARE].row >= 2 &&
    board[CURRENT_PIECE_SQUARE].col <= 6
  ) {
    if (
      board[TWO_DOWN_ONE_RIGHT].piece === null ||
      board[TWO_DOWN_ONE_RIGHT].piece.white !== piece.white
    ) {
      candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_DOWN_ONE_RIGHT);
    }
  }

  if (
    board[CURRENT_PIECE_SQUARE].row >= 2 &&
    board[CURRENT_PIECE_SQUARE].col >= 1
  ) {
    if (
      board[TWO_DOWN_ONE_LEFT].piece === null ||
      board[TWO_DOWN_ONE_LEFT].piece.white !== piece.white
    ) {
      candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_DOWN_ONE_LEFT);
    }
  }
  return candidateMoves;
}

/**
 *
 * @param {*} piece
 * @param {*} kingPosition
 * @returns
 */
export function isAllowedByOpponentKnight(piece, board, kingPosition) {
  const CURRENT_PIECE_SQUARE = piece.currentSquare;
  const TWO_RIGHT_ONE_UP = CURRENT_PIECE_SQUARE + CONSTANTS.twoRightOneUp;
  const TWO_RIGHT_ONE_DOWN = CURRENT_PIECE_SQUARE + CONSTANTS.twoRightOneDown;
  const TWO_UP_ONE_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.twoUpOneRight;
  const TWO_UP_ONE_LEFT = CURRENT_PIECE_SQUARE + CONSTANTS.twoUpOneLeft;
  const TWO_LEFT_ONE_UP = CURRENT_PIECE_SQUARE + CONSTANTS.twoLeftOneUp;
  const TWO_LEFT_ONE_DOWN = CURRENT_PIECE_SQUARE + CONSTANTS.twoLeftOneDown;
  const TWO_DOWN_ONE_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.twoDownOneRight;
  const TWO_DOWN_ONE_LEFT = CURRENT_PIECE_SQUARE + CONSTANTS.twoDownOneLeft;

  let pos = piece.currentSquare; // piece current position

  /* eslint-disable */

  if (board[pos].col < 6 && board[pos].row < 7) {
    if (TWO_RIGHT_ONE_UP == kingPosition) return false;
  }
  if (board[pos].col < 6 && board[pos].row > 0) {
    if (TWO_RIGHT_ONE_DOWN == kingPosition) return false; // move cannot be accepted (king would be eaten)
  }

  if (board[pos].col < 7 && board[pos].row < 6) {
    if (TWO_UP_ONE_RIGHT == kingPosition) return false; // move cannot be accepted (king would be eaten)
  }

  if (board[pos].col < 7 && board[pos].row < 6) {
    if (TWO_UP_ONE_LEFT == kingPosition) return false; // move cannot be accepted (king would be eaten)
  }

  if (board[pos].col > 1 && board[pos].row < 7) {
    if (TWO_LEFT_ONE_UP == kingPosition) return false; // move cannot be accepted (king would be eaten)
  }

  if (board[pos].col < 6 && board[pos].row > 0) {
    if (TWO_LEFT_ONE_DOWN == kingPosition) return false; // move cannot be accepted (king would be eaten)
  }

  if (board[pos].col < 7 && board[pos].row > 1) {
    if (TWO_DOWN_ONE_RIGHT == kingPosition) return false; // move cannot be accepted (king would be eaten)
  }

  if (board[pos].col > 0 && board[pos].row > 1) {
    if (TWO_DOWN_ONE_LEFT == kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }
  }

  /* eslint-enable */
  return true;
}

/**
 *
 * @param {*} piece
 * @param {*} kingPosition
 * @returns
 */
export function isAllowedByOpponentBlackPawn(piece, kingPosition) {
  const pos = piece.currentSquare; // ensure this is a number

  const upLeft = pos + CONSTANTS.upLeft;
  const upRight = pos + CONSTANTS.upRight;
  // eslint-disable-next-line
  if (upLeft == kingPosition || upRight == kingPosition) return false;
  return true;
}

/**
 *
 * @param {*} piece
 * @param {*} kingPosition
 * @returns
 */
export function isAllowedByOpponentWhitePawn(piece, kingPosition) {
  const DOWN_LEFT = piece.currentSquare + CONSTANTS.downLeft;
  const DOWN_RIGHT = piece.currentSquare + CONSTANTS.downRight;
  // eslint-disable-next-line
  if (DOWN_LEFT == kingPosition || DOWN_RIGHT == kingPosition) return false;
  return true;
}

/**
 *
 * @param {*} piece
 * @param {*} board
 * @param {*} candidateMoves
 */
export function getAllCandidateBishopMoves(piece, board) {
  let candidateMoves = [];
  const DLM = CONSTANTS.defaultDelim;
  let pos = piece.currentSquare;

  let squaresAvailableRight = CONSTANTS.maxCol - board[pos].col;
  let squaresAvailableUp = CONSTANTS.maxRow - board[pos].row;
  let squaresAvailableLeft = board[pos].col;
  squaresAvailableUp = CONSTANTS.maxRow - board[pos].row;

  const directions = [
    CONSTANTS.upRight,
    CONSTANTS.upLeft,
    CONSTANTS.downRight,
    CONSTANTS.downLeft,
  ];
  let squaresAvailableDown = board[pos].row;

  const numberOfSquaresAvailableUpRight =
    squaresAvailableRight < squaresAvailableUp
      ? squaresAvailableRight
      : squaresAvailableUp;
  const numberOfSquaresAvailableUpLeft =
    squaresAvailableLeft < squaresAvailableUp
      ? squaresAvailableLeft
      : squaresAvailableUp;
  const numberOfSquaresAvailableDownRight =
    squaresAvailableRight < squaresAvailableDown
      ? squaresAvailableRight
      : squaresAvailableDown;
  const numberOfSquaresAvailableDownLeft =
    squaresAvailableLeft < squaresAvailableDown
      ? squaresAvailableLeft
      : squaresAvailableDown;

  const numberOfSquaresAvailable = [
    numberOfSquaresAvailableUpRight,
    numberOfSquaresAvailableUpLeft,
    numberOfSquaresAvailableDownRight,
    numberOfSquaresAvailableDownLeft,
  ];

  for (let n = 0; n < directions.length; n++) {
    for (let i = 1; i <= numberOfSquaresAvailable[n]; i++) {
      let dstDir = pos + i * directions[n];

      if (board[dstDir].piece === null) {
        candidateMoves.push(pos + DLM + dstDir);
      } else if (board[dstDir].piece.white !== piece.white) {
        candidateMoves.push(pos + DLM + dstDir); // eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
  }
  return candidateMoves;
}

/**
 *
 * @param {*} piece
 * @param {*} board
 * @returns
 */
export function getCandidateRookMoves(piece, board) {
  const DLM = CONSTANTS.defaultDelim;
  let dst = piece.currentSquare;

  let candidateMoves = [];

  const UP_MOVES = CONSTANTS.maxRow - board[dst].row;
  const DOWN_MOVES = board[dst].row;
  const RIGHT_MOVES = CONSTANTS.maxCol - board[dst].col;
  const LEFT_MOVES = board[dst].col;
  const MOVES = [UP_MOVES, DOWN_MOVES, RIGHT_MOVES, LEFT_MOVES];

  const MOVESTEP = [
    CONSTANTS.up,
    CONSTANTS.down,
    CONSTANTS.right,
    CONSTANTS.left,
  ];

  for (let n = 0; n < MOVES.length; ++n) {
    // length == 4
    for (let i = 0; i < MOVES[n]; ++i) {
      // UP, DOWN, RIGHT, LEFT
      let targetSquare = dst + (i + 1) * MOVESTEP[n];
      if (board[targetSquare].piece === null) {
        candidateMoves.push(dst + DLM + targetSquare);
      } else if (piece.white !== board[targetSquare].piece.white) {
        candidateMoves.push(dst + DLM + targetSquare); // capture
        break;
      } else {
        break; // own piece blocks
      }
    }
  }
  return candidateMoves;
}

/**
 *
 * @param {*} piece
 * @param {*} squares
 * @param {*} kingPosition
 * @param {*} candidateMove
 * @returns
 */
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

/**
 *
 * @param {*} piece
 * @param {*} kingPosition
 * @returns
 */
export function isAllowedByOpponentKing(piece, kingPosition) {
  let allowed = true;
  let pos = piece.currentSquare; // ensure this is dealt as an integer!

  let up = pos + CONSTANTS.up;
  let down = pos + CONSTANTS.down;
  let left = pos + CONSTANTS.left;
  let right = pos + CONSTANTS.right;
  let downLeft = pos + CONSTANTS.downLeft;
  let downRight = pos + CONSTANTS.downRight;
  let upLeft = pos + CONSTANTS.upLeft;
  let upRight = pos + CONSTANTS.upRight;

  /* eslint-disable */
  if (up == kingPosition) return false; // reject move #1
  if (down == kingPosition) return false; // reject move #2
  if (left == kingPosition) return false; // reject move #3
  if (right == kingPosition) return false; // reject move #4
  if (downRight == kingPosition) return false; // reject move #5
  if (upRight == kingPosition) return false; // reject move #6
  if (upLeft == kingPosition) return false; // reject move #7
  if (downLeft == kingPosition) return false; // reject move #8
  /* eslint-enable */
  return allowed;
}

/**
 *
 * @param {*} piece
 * @param {*} board
 * @param {*} kingPosition
 * @param {*} opponentCandidateMove
 * @returns
 */
export function isAllowedByOpponentBishop(
  piece,
  board,
  kingPosition,
  opponentCandidateMove
) {
  ///

  let pos = piece.currentSquare;

  let squaresAvailableRight = CONSTANTS.maxCol - board[pos].col;
  let squaresAvailableUp = CONSTANTS.maxRow - board[pos].row;
  let squaresAvailableLeft = board[pos].col;
  squaresAvailableUp = CONSTANTS.maxRow - board[pos].row;

  const directions = [
    CONSTANTS.upRight,
    CONSTANTS.upLeft,
    CONSTANTS.downRight,
    CONSTANTS.downLeft,
  ];
  let squaresAvailableDown = board[pos].row;

  const numberOfSquaresAvailableUpRight =
    squaresAvailableRight < squaresAvailableUp
      ? squaresAvailableRight
      : squaresAvailableUp;
  const numberOfSquaresAvailableUpLeft =
    squaresAvailableLeft < squaresAvailableUp
      ? squaresAvailableLeft
      : squaresAvailableUp;
  const numberOfSquaresAvailableDownRight =
    squaresAvailableRight < squaresAvailableDown
      ? squaresAvailableRight
      : squaresAvailableDown;
  const numberOfSquaresAvailableDownLeft =
    squaresAvailableLeft < squaresAvailableDown
      ? squaresAvailableLeft
      : squaresAvailableDown;

  const numberOfSquaresAvailable = [
    numberOfSquaresAvailableUpRight,
    numberOfSquaresAvailableUpLeft,
    numberOfSquaresAvailableDownRight,
    numberOfSquaresAvailableDownLeft,
  ];

  const DLM = CONSTANTS.defaultDelim;

  let allowed = true;

  const move = opponentCandidateMove.split(DLM); // [1] === dst move
  const canditSrc = parseInt(move[0], 10); // ensure that it's an integer!
  const canditDst = parseInt(move[1], 10);

  for (let n = 0; n < directions.length; n++) {
    for (let i = 1; i <= numberOfSquaresAvailable[n]; i++) {
      let dstDir = pos + i * directions[n];

      /* eslint-disable */
      if (kingPosition == dstDir) {
        return false; // move cannot be accepted (king would be eaten)
      } else if (dstDir == canditDst) {
        break;
        // eslint-disable-next-line
      } else if (dstDir == canditSrc) {
        /* eslint-enable */
        continue; // this piece doesn't block anymore
      } else if (board[dstDir].piece !== null) {
        //canditSrc can't be here!
        // own or opponent's piece
        break;
      }
    }
  }
  return allowed;
}

/**
 *
 * @param {*} piece
 * @param {*} board
 * @param {*} kingPosition
 * @param {*} opponentCandidateMove
 * @returns
 */
export function isAllowedByOpponentRook(
  piece,
  board,
  kingPosition,
  opponentCandidateMove
) {
  const DLM = CONSTANTS.defaultDelim;
  let allowed = true;

  let pos = piece.currentSquare;

  const move = opponentCandidateMove.split(DLM); // [1] === dst move
  const canditSrc = parseInt(move[0], 10);
  const canditDst = parseInt(move[1], 10);

  const UP_MOVES = CONSTANTS.maxRow - board[pos].row;
  const DOWN_MOVES = board[pos].row;
  const RIGHT_MOVES = CONSTANTS.maxCol - board[pos].col;
  const LEFT_MOVES = board[pos].col;
  const MOVES = [UP_MOVES, DOWN_MOVES, RIGHT_MOVES, LEFT_MOVES];

  const MOVESTEP = [
    CONSTANTS.up,
    CONSTANTS.down,
    CONSTANTS.right,
    CONSTANTS.left,
  ];

  for (let n = 0; n < MOVES.length; ++n) {
    // length == 4
    for (let i = 0; i < MOVES[n]; ++i) {
      // UP, DOWN, RIGHT, LEFT
      let targetSquare = pos + (i + 1) * MOVESTEP[n];
      /* eslint-disable */
      if (targetSquare == kingPosition) {
        return false; // this move wasn't allowed by the rook
      }
      let squarePiece = board[targetSquare].piece;

      if (targetSquare == canditDst) {
        break;
      } else if (canditSrc == targetSquare) {
        continue;
        /* eslint-enable */
      } else if (squarePiece !== null) {
        break; // move accepted; collides with own or eats opponent's piece; both are OK
      }
    }
  }
  return allowed;
}

/**
 *
 * @param {*} piece
 * @param {*} board
 * @returns
 */
export function getCandidateQueenMoves(piece, board) {
  let candidateMovesQueen = [];

  let candidateMovesBishop = getAllCandidateBishopMoves(piece, board);
  let candidateMovesRook = getCandidateRookMoves(piece, board);
  candidateMovesQueen = candidateMovesBishop.concat(candidateMovesRook);
  return candidateMovesQueen;
}
