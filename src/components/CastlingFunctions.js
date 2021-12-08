/**
 *
 * @param {*} board
 * @returns
 */
export function castleQueenSideBlack(board) {
  if (board[4].piece && board[0].piece) {
    // this condition is enough at this point!
    board[2].piece = board[4].piece;
    board[4].piece = null;
    board[3].piece = board[0].piece;
    board[0].piece = null;
  } else {
    console.error(
      "ERROR: KingB or RookBA has moved alread, castling not allowed!"
    );
  }
  return board;
}

/**
 *
 * @param {*} board
 * @returns
 */
export function castleKingSideBlack(board) {
  if (board[4].piece && board[7].piece) {
    board[6].piece = board[4].piece;
    board[4].piece = null;
    board[5].piece = board[7].piece;
    board[7].piece = null;
  } else {
    console.error(
      "ERROR: KingB or RookBH has moved alread, castling not allowed!"
    );
  }
  return board;
}

/**
 *
 * @param {*} board
 * @returns
 */
export function castleQueenSideWhite(board) {
  if (board[60].piece && board[56].piece) {
    // this condition is sufficient!

    board[58].piece = board[60].piece;
    board[60].piece = null;
    board[59].piece = board[56].piece;
    board[56].piece = null;
  } else {
    console.error(
      "ERROR: KingW or RookWA has moved alread, castling not allowed!"
    );
  }
  return board;
}

/**
 *
 * @param {*} board
 * @returns
 */
export function castleKingSideWhite(board) {
  if (board[60].piece && board[63].piece) {
    // this condition is sufficient!
    board[62].piece = board[60].piece;
    board[60].piece = null;
    board[61].piece = board[63].piece;
    board[63].piece = null;
  } else {
    console.error(
      "ERROR: KingW or RookWH has moved alread, castling not allowed!"
    );
  }
  return board;
}
