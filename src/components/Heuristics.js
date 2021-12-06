import CONSTANTS from "../config/constants";
import * as ThreatScores from "./ThreatScores";

/**
 *
 *
 * Recursive threat scores for both. Same heuristics for both. Allowed moves vs. threat scores vs. check/(good)defense.
 *
 * add heuristics: isPieceDefended, isPieceThreatening, isPieceCapturingValuable...isPieceDeliveringCheck..., pawnMovesTwo
 * promotion, castling...enPassant.., isPieceUnderAttackByLessValuablePiece
 */
//-> select the highest point functioned candidate board

/**
 * Get the candidate board which represents the best move (max points)
 * @param {*} candidateBoards
 * @param {*} white
 * @returns
 */
export function getMaxPointCandidateBoard(candidateBoards, white) {
  let points = getPointsForAllCandidateBoards(candidateBoards);
  let maxPoint = Math.max(points);

  let bestBoard = candidateBoards(points.indexOf(maxPoint));
  return bestBoard;
}

/**
 * Use the "score function" to calculate how valuable this particular (candidate) board is for white / black.
 *
 * Heuristics: nextPossibleMoves - nextPossibleOpponentMoves + checksAgainstOpponent - checksAgainstMe + threats + protectedThreats + totalPieceValue
 * 1. this score -> board0
 * 2. opponent score (next turn) [candidate moves, allowed moves, best move...] -> selected board1
 * 3. own next move (next next turn) score -> board2
 * 4. total score: board0Score + board1Score + board2Score , ..., + boardNScore
 *
 * @param {*} selectedCandidateBoard
 * @returns
 */
export function getPointsForASelectedCandidateBoard(selectedCandidateBoard) {
  let points; // integer

  let board0Points = 0; // nextPossibleMoves - opponentNextPossibleMoves + check...
  let board1Points = 0;
  let board2Points = 0;

  points = board0Points + board1Points + board2Points;
  return points;
}

/**
 * Get first round points per candidateboard
 * @param {*} candidateBoards
 */
export function getPointsForAllCandidateBoards(candidateBoards) {
  let pointsPerBoard = []; // array or list

  for (let i = 0; i < candidateBoards.length; i++) {
    pointsPerBoard[i] = getPointsForASelectedCandidateBoard(candidateBoards[i]);
  }
  return pointsPerBoard;
}

/**
 * board -> candidate moves -> allowedMoves == candidate boards
 * @param {*} selectedCandidateBoard
 */
export function getNextCandidateBoardsFromASelectedCandidateBoard(
  selectedCandidateBoard
) {
  let candidateBoards;

  return candidateBoards;
}

/**
 *
 * @param {*} allowedMove
 */
export function doublePawnPointsHandling(allowedMove) {
  let extraPoints = 0;
  if (CONSTANTS.DOBLE_PAWN_STRING.includes(allowedMove)) {
    //console.log("add extra point here");
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
export function getMoveExtraPoints(allowedMove, candidateBoard, previousBoard) {
  let extraPoints = 0;

  if (candidateBoard[64] === CONSTANTS.CHECK) {
    extraPoints = 2;
  }
  return extraPoints;
}

/**
 * If after a (candidate) move, a higher valued piece is possible to be captured immediately with a lower valued piece,
 * reduce points. E.g. if a queen captures a rook, but can be then captures by some other piece (of lower  value?),
 * reduce points. The purpose is of avoiding these kinds of blunder being selected as the best move (turn).
 * The example move is allowed, but normally not suggested. A sacrificing move is an exception.
 *
 * The get the possible reduction, we always need to check the opponent's possible next turn, e.g.
 * whether the opponet can capture white's queen after white's turn.
 *
 * While checking for candidate moves and rejecting illegal moves, it's also possible to reduce points
 * if a aforementioned situation happens. (More optimized than checking again within allowed moves?)
 *
 * @param {*} allowedMove
 * @param {*} candidateBoard
 * @param {*} previousBoard
 */
export function getMoveReducedPointsDueToLostPiece(
  allowedMove,
  candidateBoard,
  previousBoard
) {
  let extraPoints = -10; // this should depend on the valor of the lost piece (e.g.  -9 + 4)

  return extraPoints;
}

// minimize threat score
// go through the every opponent black piece in the board and calculate the threat score IF the candidate white move was played
// this could be used as an universal function to calculate also possible CHECK threats (moves not allowed)
/**
 *
 * @param {*} board
 * @returns
 */
export function getMinimizedThreatScore(board) {
  let threatScore = 0;

  threatScore = ThreatScores.getTotalOpponentThreatScoreAgainstMe(board);

  return threatScore;
}
