import CONSTANTS from "../config/constants";
import * as ThreatScores from "./ThreatScores";
import * as HelpFunctions from "./HelpFunctions";
import * as CheckFunctions from "./CheckFunctions";

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
   *
   * @param {*} white
   * @param {*} candidateBoards
   * @param {*} allowedMoves
   * @param {*} numberOfPossibleNextMoves
   * @returns
   */
 export function getMaxMovesIndexWhileAvoidingStalemate(
  white,
  candidateBoards,
  allowedMoves,
  numberOfPossibleNextMoves
) {
  let max = 0;
  let maxIdx;

  for (let i = 0; i < candidateBoards.length; ++i) {
    if (candidateBoards[i][64] === CONSTANTS.CHECK) {
      let numberOfAllowedOpponentMoves = this.getNumberOfAllowedOpponentMoves(
        white,
        i,
        candidateBoards
      );
      // eslint-disable-next-line
      if (numberOfAllowedOpponentMoves == 0) {
        return i; // this will be maxIdx, because it's an immediate mate!
      } else if (numberOfAllowedOpponentMoves < 2) {
        // TODO: at this point the opponent has only one possibly move which could mean an impending mate; this strategy should be refined
        return i;
      }
      // TODO: handle double consequtive moves mates, i.e. if the next move after this one is able to deliver a mate, select this move
      // the opponent may have multiple moves to avoid the mate
    }
    if (numberOfPossibleNextMoves[i] >= max) {
      numberOfPossibleNextMoves[i] += doublePawnPointsHandling(
        allowedMoves[i]
      ); // Heuristics#1
      max = numberOfPossibleNextMoves[i]; // select the move from the allowed moves which got the highest points
      maxIdx = i;
    }
  }
  if (this.state.DEBUG) {
    console.log("INITIALLY SELECTED max = " + max + " idx = " + maxIdx);
  }

  if (
    this.getNumberOfAllowedOpponentMoves(
      white,
      maxIdx,
      candidateBoards
      // eslint-disable-next-line
    ) == 0
  ) {
    // (review this): opponent can't move -> stalemate!
    console.log(
      "STALEMATE PREVENTION, SKIP THIS MOVE: " +
        allowedMoves[maxIdx] +
        " ** max rejected: " +
        max
    );

    numberOfPossibleNextMoves.splice(maxIdx, 1); // remove allowedMoves[maxIdx] from the array to avoid stalemate
    candidateBoards.splice(maxIdx, 1);
    allowedMoves.splice(maxIdx, 1); // to get the counter right, we need to remove from here too

    maxIdx = this.getMaxMovesIndexWhileAvoidingStalemate(
      white,
      candidateBoards,
      allowedMoves,
      numberOfPossibleNextMoves
    ); // recursion is OK here
  } else {
    /*console.log(
      "MAX accepted, max = " +
        max +
        " idx = " +
        maxIdx +
        " move = " +
        allowedMoves[maxIdx]
    );*/
  }
  /*console.log(
    "returning: max = " +
      max +
      " max_idx=" +
      maxIdx +
      " numberOfPossibleNextMoves = " +
      numberOfPossibleNextMoves +
      " allowedMoves[maxIdx] = " +
      allowedMoves[maxIdx]
  );*/
  return maxIdx;
}

/**
   *
   * @param {*} board
   * @param {*} allowedMoves
   * @param {*} optimalThreatScoreBoardIndex min for white, max for black
   * @returns
   */
 export function getSelectedMove(board, allowedMoves, optimalThreatScoreBoardIndex) {
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
  if (checkMoves.length > 0) { // TODO, optimize the strategy, checkmoves should give POINTS to compare them with threatScore!
    selectedMove = checkMoves[0]; // just take the first check move
  }
  let idx = selectedMove.indexOf(allowedMoves);
  if (idx !== optimalThreatScoreBoardIndex && optimalThreatScoreBoardIndex === 0) {
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
