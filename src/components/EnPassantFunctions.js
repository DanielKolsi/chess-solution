import CONSTANTS from "../config/constants";

/**
 * 
 * @param {*} board 
 * @param {*} moves 
 * @returns 
 */
export function doEnPassantComplete(board, moves) {
  let pieceToBeRemovedSquare = null;

  const srcSquare = parseInt(moves[0], 10);
  const dstSquare = parseInt(moves[1], 10);

  if (dstSquare === srcSquare + CONSTANTS.downLeft) {
    pieceToBeRemovedSquare = srcSquare + CONSTANTS.left;
  } else if (dstSquare === srcSquare + CONSTANTS.downRight) {
    pieceToBeRemovedSquare = srcSquare + CONSTANTS.right;
  } else if (dstSquare === srcSquare + CONSTANTS.upLeft) {
    pieceToBeRemovedSquare = srcSquare + CONSTANTS.left;
  } else if (dstSquare === srcSquare + 9) {
    pieceToBeRemovedSquare = srcSquare + CONSTANTS.right;
  }

  board[dstSquare].piece = board[srcSquare].piece;
  board[srcSquare].piece = null;
  console.log("removed piece = " + pieceToBeRemovedSquare);
  board[pieceToBeRemovedSquare].piece = null;
  return board;
}
