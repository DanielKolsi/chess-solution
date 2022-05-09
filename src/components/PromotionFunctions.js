/**
 *
 * @param {*} board
 * @param {*} moves
 * @param {*} promotedPieceNumber
 * @returns
 */
export function doPromote(board, pieces, moves, promotedPieceNumber) {
  
  board[moves[1]].piece = pieces[promotedPieceNumber];
  board[moves[1]].piece.currentSquare = parseInt(moves[1], 10);
  board[moves[0]].piece = null;

  return board;
}
