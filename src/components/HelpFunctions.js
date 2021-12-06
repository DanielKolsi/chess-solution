
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