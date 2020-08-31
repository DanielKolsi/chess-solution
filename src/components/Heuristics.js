import CONSTANTS from "../config/constants";

/**
 * 
 * @param {*} allowedMove 
 */
export function doublePawnPointsHandling(allowedMove) {
  let extraPoints = 0;
  if (CONSTANTS.DOBLE_PAWN_STRING.includes(allowedMove)) {
    console.log("add extra point here");
    extraPoints = 1;
  }
  return extraPoints;
}

/**
 * Analyze the move and decide how many extra points this move is worth. This could depend on: possible threats, check, 
 * board total value change, how own pieces are defended after the move, how own king is defended after the move etc.
 * 
 * @param {*} allowedMove 
 * @param {*} candidateBoard 
 */
export function getMoveExtraPoints(allowedMove, candidateBoard) {
    let extraPoints = 0;
    
    return extraPoints;
  }
