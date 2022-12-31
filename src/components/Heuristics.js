import CONSTANTS from "../config/constants";
import * as ThreatScores from "./ThreatScores";
import * as HelpFunctions from "./HelpFunctions";
import * as CheckFunctions from "./CheckFunctions";

/**
 * No state setting.
 *
 * Recursive threat scores for both. Same heuristics for both. Allowed moves vs. threat scores vs. check/(good)defense.
 *
 * add heuristics: isPieceDefended, isPieceThreatening, isPieceCapturingValuable...isPieceDeliveringCheck..., pawnMovesTwo
 * promotion, castling...enPassant.., isPieceUnderAttackByLessValuablePiece
 *
 * 1. Get absolute score for a all boards (candidateBoards, white)
 * 2. Get best board i.e. board having the highest/best score (from 1.)
 * 3. score: threat score, max allowed moves, min opponent moves...
 * 4. getNextBoardsForASelectedBoard (next moves, allowedMove->board)
 * 5. threat score for candidate boards -> ThreatScores
 *
 */
//-> select the highest point functioned candidate board

// like 2nd (black) ply in 549 
export function filterOpponentUnprotectedDoubleThreat(arrayOfCandidateBoards) {

}

// return the sum of array integers
export function getCheckSum(array) {
  let sum = 0;
  for(let i = 0; i < array.length; ++i) {
    sum+=array[i];
  }
  return sum;
}

/**
 * This superarray contains arrays and each array contains scores of boards. Each board thus maps to
 * one array from superarray, and superarray contains as many arrays as there are possible moves (e.g. for white).
 *
 * Each array has its max scores, and the array number (which correspond the candidate board number) which has the
 * highest score should be selected. That is, first we need to select max score from each array, and compare the
 * individual array max scores, and then select the "max from the max scores" which will correspond the selected array i.e.
 * the best candidate board that we're going to select as the best move.
 *
 * @param {*} arrayOfArrayOfCandidateBoardScores
 */
export function getCandidateBoardNumberCorrespondingMaxScore(
  arrayOfArrayOfCandidateBoardScores
) {
  // index of Math.max(array)
  let maxScoresForArrays = [];
  for (let i = 0; i < arrayOfArrayOfCandidateBoardScores.length; i++) {    
    let array = arrayOfArrayOfCandidateBoardScores[i];
    maxScoresForArrays[i] = Math.max.apply(Math, array);
  }
  let maxArrayScore = Math.max.apply(Math, maxScoresForArrays);
  return maxScoresForArrays.indexOf(maxArrayScore); // candidate board i.e. move number from the candidateBoards to be selected
}

//export function getAbsoluteScoreForAllCandidateboards(candidateBoards, white) {}



//export function getNextBoardForASelectedBoard(board, white) {}

/*
 This function maps absoluteMoveIndex to the bestNextMoveIndex using the information from scoreArray
*/
export function getBestNextMoveBoardNumber(scoreArray, absoluteMoveIndex) {
  
  let bestNextMoveIndex = 0; 
  let incrementedScore =  scoreArray[bestNextMoveIndex];
  
  while (absoluteMoveIndex >= incrementedScore) {  // as index starts from 0, e.g. 5th move index is 6th move
    incrementedScore += scoreArray[++bestNextMoveIndex];  
  }
  return bestNextMoveIndex;
}

/**
 *
 * @param {*} board
 * @param {*} allowedMoves
 * @param {*} optimalThreatScoreBoardIndex min for white, max for black
 * @returns
 */
export function getSelectedMove(
  board,
  allowedMoves,
  optimalThreatScoreBoardIndex
) {
  // this will be the final selected move for white / black determined by the heuristics / strategy
  let selectedMove = getBestMove(board, allowedMoves);

  if (selectedMove === null) {
    let maxIdx = optimalThreatScoreBoardIndex;
    //selectedMove = allowedMoves[maxIdx];
    //max = numberOfPossibleNextMoves[maxIdx];
    console.log(" optimalThreatScoreBoardIdx=" + maxIdx);
    selectedMove = allowedMoves[optimalThreatScoreBoardIndex]; // strategy is just to select the lowest threat score against black
  }

  const checkMoves = CheckFunctions.getCheckMoves(allowedMoves);
  if (checkMoves.length > 0) {
    // TODO, optimize the strategy, checkmoves should give POINTS to compare them with threatScore!
    selectedMove = checkMoves[0]; // just take the first check move
  }
  let idx = selectedMove.indexOf(allowedMoves);
  if (
    idx !== optimalThreatScoreBoardIndex &&
    optimalThreatScoreBoardIndex === 0
  ) {
    selectedMove = allowedMoves[optimalThreatScoreBoardIndex];
  }

  console.log(
    "sel check move = " +
      selectedMove +
      " || minThreatScoreBoardIndex = " +
      optimalThreatScoreBoardIndex +
      " allowed moves length = " +
      allowedMoves.length
  );
  return selectedMove;
}
/**
 *
 * @param {*} board
 * @param {*} allowedMoves
 * @param {*} white
 * @returns
 */
export function getBestMove(board, allowedMoves) {
  let moveValue = 0; // value is calculated by substraction own piece value from the captured piece value
  let bestMoveIndex = -1;

  for (let i = 0; i < allowedMoves.length; i++) {
    const delim = HelpFunctions.getDelim(allowedMoves[i]);

    const move = allowedMoves[i].split(delim);
    const src = move[0];
    const dst = move[1];

    //console.log("best move : allowed move  = " + move + " l = " + allowedMoves.length);
    if (board[dst].piece !== null) {
      // compare piece values, if valueable, possibly worth eating..?!, piece.value
      if (board[dst].piece.value > board[src].piece.value) {
        let value =
          Math.abs(board[dst].piece.value) - Math.abs(board[src].piece.value);
        console.log("VALUE=" + value);
        if (value >= moveValue) {
          moveValue = value;
          console.log(
            "move value = " +
              value +
              " best move idx = " +
              i +
              " src value = " +
              board[src].piece.value
          );
          bestMoveIndex = i;
        }
      }
    }
  }
  if (bestMoveIndex > 0) {
    console.log("best move for black... = " + allowedMoves[bestMoveIndex]);
    return allowedMoves[bestMoveIndex];
  }

  if (moveValue > 0) {
    return bestMoveIndex;
  } else return null;
}

/**
 * Get the candidate board which represents the best move (max points)
 * @param {*} candidateBoards
 * @param {*} white
 * @returns
 */
export function getMaxPointCandidateBoard(candidateBoards) {
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
