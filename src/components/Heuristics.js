import CONSTANTS from "../config/constants";
import * as ThreatScores from "./ThreatScores";

/**
 * TODO: add heuristics: isPieceDefended, isPieceThreatening, isPieceCapturingValuable...isPieceDeliveringCheck..., pawnMovesTwo
 * promotion, castling...enPassant.., isPieceUnderAttackByLessValuablePiece
 * 
 * TODO:  getAllowedMovesWithPointReductionArray()
 */

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
  export function getMoveReducedPointsDueToLostPiece(allowedMove, candidateBoard, previousBoard) {
    let extraPoints = -10; // this should depend on the valor of the lost piece (e.g.  -9 + 4)
    
    
    return extraPoints;
  }

  // minimize threat score
  // go through the every opponent black piece in the board and calculate the threat score IF the candidate white move was played
  // this could be used as an universal function to calculate also possible CHECK threats (moves not allowed)
  export function getWhiteThreatScore(board, whiteCandidateMove) {
    
let threatScore = 0;
    for (let i = 0; i <= 63; i++) {
      let piece = board[i].piece;
      
     
      if (piece === null || piece === undefined) {
        continue; // piece has been e.g. eaten or is a pawn
      }
      
      const value = piece.value;
      
      
      
      switch (value) {
        case CONSTANTS.BLACK_PAWN_CODE: 
         //threatScore+=getBlackPawnThreatScore(piece);
          break;
        case CONSTANTS.BLACK_KNIGHT_CODE:
        //  
        break;
        case CONSTANTS.BLACK_BISHOP_CODE:
          //
          break;
        case CONSTANTS.BLACK_ROOK_CODE:
          //
          break;
        case CONSTANTS.BLACK_KING_CODE:
          //
          break;
        case CONSTANTS.BLACK_QUEEN_CODE:
          //
          break;
        default:
          break;
      }
      
    }
    return threatScore; // threat score: the higher the worse
  }
