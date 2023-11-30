/**
 *
 * @param {*} move
 * @returns
 */
export function getDelim(move) {
  const CHR = move.charAt(2);
  return isNaN(CHR) ? CHR : move.charAt(1);
}

/**
 *
 * @param {*} move
 * @returns
 */
export function getMovesString(move) {
  const DELIMITER = getDelim(move);
  return move.split(DELIMITER);
}

export function getRowForSquareNumber(squareNumber) {
  let row = 1 + squareNumber / 8;
  return Math.floor(row);
}

export function getColForSquareNumber(squareNumber) {
  if (squareNumber < 8) return squareNumber + 1;
  let modulo = (squareNumber + 1) % 8;
  let col = module === 0 ? 8 - modulo : modulo;
  return col;
}
