import CONSTANTS from "../config/constants";
import * as HelpFunctions from "./HelpFunctions";

/**
 *
 * @param {*} allowedMoves
 */
export function getCheckMoves(allowedMoves) {
  let checkMoves = [];

  for (let i = 0; i < allowedMoves.length; i++) {
    let delim = HelpFunctions.getDelim(allowedMoves[i]);
    if (delim === CONSTANTS.CHECK) {
      checkMoves.push(allowedMoves[i]);
    }
  }
  return checkMoves;
}


/**
   *
   * @param {*} board
   * @param {*} allowedMoves
   * @param {*} white
   */
 export function getTransformToPlusDelimForCheckMoves(board, allowedMoves, white) {
  
  for (let i = 0; i < allowedMoves.length; i++) {
    const moves = HelpFunctions.getMovesString(allowedMoves[i]);
    const src = parseInt(moves[0], 10);
    let piece = board[src].piece;
  
    // TOOD: BUG/Piece was null here: 10/11/23
    switch (
      Math.abs(piece.value) // handles both white & black piece values
    ) {
      case CONSTANTS.WHITE_PAWN_CODE:
        allowedMoves[i] = getCheckPlusSymbolForPawnMove(
          board,
          allowedMoves[i],
          white
        );
        break;
      case CONSTANTS.WHITE_KNIGHT_CODE:
        allowedMoves[i] = getCheckPlusSymbolForKnightMove(
          board,
          allowedMoves[i],
          white
        );
        break;
      case CONSTANTS.WHITE_BISHOP_CODE:
        allowedMoves[i] = getCheckPlusSymbolForBishopMove(
          board,
          allowedMoves[i],
          white
        );
        break;
      case CONSTANTS.WHITE_ROOK_CODE:
        allowedMoves[i] = getCheckPlusSymbolForRookMove(
          board,
          allowedMoves[i],
          white
        );
        break;
      case CONSTANTS.WHITE_QUEEN_CODE:
        allowedMoves[i] = getCheckPlusSymbolForQueenMove(
          board,
          allowedMoves[i],
          white
        );
        break;
      default:
      // console.log("DEFAULT: " + white);
    }
  }
  return allowedMoves;
}

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
    if (board[dst].col > 0 && board[dst].row > 0) {
      if (
        board[DOWNLEFT_DST].piece !== null &&
        board[DOWNLEFT_DST].piece.value === KING_CODE
      ) {
        allowedMove = src + CONSTANTS.CHECK + dst;
        return allowedMove;
      }
    }
    if (board[dst].col < 7 && board[dst].row > 0) {
      if (
        board[DOWNRIGHT_DST].piece !== null &&
        board[DOWNRIGHT_DST].piece.value === KING_CODE
      ) {
        allowedMove = src + CONSTANTS.CHECK + dst;
        return allowedMove;
      }
    }
  } else {
    const UPLEFT_DST = dst + CONSTANTS.upLeft;
    const UPRIGHT_DST = dst + CONSTANTS.upRight;

    if (board[dst].col > 0 && board[dst].row < 7) {
      if (
        board[UPLEFT_DST].piece !== null &&
        board[UPLEFT_DST].piece.value === KING_CODE
      ) {
        allowedMove = src + CONSTANTS.CHECK + dst;
        return allowedMove;
      }
    }
    if (board[dst].col < 7 && board[dst].row < 7) {
      if (
        board[UPRIGHT_DST].piece !== null &&
        board[UPRIGHT_DST].piece.value === KING_CODE
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
      board[TWO_RIGHT_ONE_UP_DST].piece.value === KING_CODE
    ) {
      allowedMove = src + CONSTANTS.CHECK + dst;
      return allowedMove;
    }
  }

  if (board[dst].row >= 2 && board[dst].col <= 6) {
    if (
      board[TWO_DOWN_ONE_RIGHT_DST].piece !== null &&
      board[TWO_DOWN_ONE_RIGHT_DST].piece.value === KING_CODE
    ) {
      allowedMove = src + CONSTANTS.CHECK + dst;
      return allowedMove;
    }
  }

  // 2 right, 1 down
  if (board[dst].row >= 1 && board[dst].col <= 5) {
    if (
      board[TWO_RIGHT_ONE_DOWN_DST].piece !== null &&
      board[TWO_RIGHT_ONE_DOWN_DST].piece.value === KING_CODE
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
      board[TWO_UP_ONE_RIGHT_DST].piece.value === KING_CODE
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
      board[TWO_LEFT_ONE_DOWN_DST].piece.value === KING_CODE
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
      board[TWO_DOWN_ONE_LEFT_DST].piece.value === KING_CODE
    ) {
      allowedMove = src + CONSTANTS.CHECK + dst;
      return allowedMove;
    }
  }
  return allowedMove;
}

/**
 * If check, convert the bishop's move's "general" move symbol (->) to CHECK symbol (+), else return original move with the original symbol.
 * @param {*} board
 * @param {*} allowedMove
 * @param {*} white
 * @returns
 */
export function getCheckPlusSymbolForBishopMove(board, allowedMove, white) {
  const moves = HelpFunctions.getMovesString(allowedMove);
  const src = parseInt(moves[0], 10);
  const dst = parseInt(moves[1], 10);

  let KING_CODE = white ? CONSTANTS.BLACK_KING_CODE : CONSTANTS.WHITE_KING_CODE;

  let squaresAvailableRight = CONSTANTS.maxCol - board[dst].col;
  let squaresAvailableUp = CONSTANTS.maxRow - board[dst].row;
  let squaresAvailableLeft = board[dst].col;
  squaresAvailableUp = CONSTANTS.maxRow - board[dst].row;

  const directions = [
    CONSTANTS.upRight,
    CONSTANTS.upLeft,
    CONSTANTS.downRight,
    CONSTANTS.downLeft,
  ];
  let squaresAvailableDown = board[dst].row;

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
      let dstDir = dst + i * directions[n];

      if (board[dstDir].piece === null) {
        continue;
      } else if (board[dstDir].piece.value === KING_CODE) {
        allowedMove = src + CONSTANTS.CHECK + dst;
        return allowedMove; // do the '+' conversion
      } else {
        break; // blocked by non-king piece
      }
    }
  }

  return allowedMove;
}

/**
 *
 * @param {*} board
 * @param {*} allowedMove
 * @param {*} white
 * @returns
 */
export function getCheckPlusSymbolForRookMove(board, allowedMove, white) {
  const moves = HelpFunctions.getMovesString(allowedMove);
  const src = parseInt(moves[0], 10);
  const dst = parseInt(moves[1], 10);

  let KING_CODE = white ? CONSTANTS.BLACK_KING_CODE : CONSTANTS.WHITE_KING_CODE;

  const UP_MOVES = CONSTANTS.maxRow - board[dst].row;
  const DOWN_MOVES = board[dst].row;
  const RIGHT_MOVES = CONSTANTS.maxCol - board[dst].col;
  const LEFT_MOVES = board[dst].col;
  const MOVES = [UP_MOVES, DOWN_MOVES, RIGHT_MOVES, LEFT_MOVES];

  const MOVESTEP = [CONSTANTS.up, CONSTANTS.down, CONSTANTS.right, CONSTANTS.left];  

  for (let n = 0; n < MOVES.length; ++n) { // length == 4  
    for (let i = 0; i < MOVES[n]; ++i) { // UP, DOWN, RIGHT, LEFT
      let targetSquare = dst + ((i + 1) * MOVESTEP[n]); 
      if (board[targetSquare].piece === null) {
        continue;
      } else if (board[targetSquare].piece.value === KING_CODE) {        
        allowedMove = src + CONSTANTS.CHECK + dst;
        return allowedMove; // do the '+' conversion
      } else {
        break;
      }
    }
  }  
  return allowedMove;
}

/**
 *
 * @param {*} board
 * @param {*} allowedMove
 * @param {*} white
 */
export function getCheckPlusSymbolForQueenMove(board, allowedMove, white) {
  let move = getCheckPlusSymbolForRookMove(board, allowedMove, white);
  let delim = HelpFunctions.getDelim(move);

  if (delim === CONSTANTS.CHECK) {
    return move; // already a check move due to rook movements, no need to analyze bishop movements
  } else {
    return getCheckPlusSymbolForBishopMove(board, allowedMove, white);
  }
}