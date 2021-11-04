import CONSTANTS from "../config/constants";

// 1. White candidate move 2. check all black next allowed moves to check the threats 3. sum threat scores piece (move) by piece

export function getBlackPawnThreatScore(piece, board) {
  const pos = piece.pos;
  const upLeft = pos + CONSTANTS.upLeft;
  const upRight = pos + CONSTANTS.upRight;
  let threatScore = 0;
  let leftValue = board[upLeft].piece.value;
  let rightValue = board[upRight].piece.value;

  if (board[upLeft].piece.value > 0) {
    threatScore += leftValue;
  }
  if (board[upRight].piece.value > 0) {
    threatScore += rightValue;
  }

  return threatScore;
}

export function getBishopThreatScore(piece, board, squares) {
  
  const currentPieceSquare = piece.currentSquare;

  const squaresAvailableRight = CONSTANTS.maxCol - board[currentPieceSquare].col;
  const squaresAvailableUp = CONSTANTS.maxRow - board[currentPieceSquare].row;
  const squaresAvailableLeft = squares[currentPieceSquare].col;

  let numberOfSquaresAvailable;
  let threatScore = 0;

  if (squaresAvailableRight <= squaresAvailableUp) {
    numberOfSquaresAvailable = squaresAvailableRight;
  } else {
    numberOfSquaresAvailable = squaresAvailableUp;
  }

  threatScore += getDiagonalThreatScore(board, piece, CONSTANTS.upRight, numberOfSquaresAvailable); // upRight
  
  if (squaresAvailableLeft <= squaresAvailableUp) {
    numberOfSquaresAvailable = squaresAvailableLeft;
  } else {
    numberOfSquaresAvailable = squaresAvailableUp;
  }

  
  threatScore += getDiagonalThreatScore(board, piece, CONSTANTS.upLeft, numberOfSquaresAvailable); // upLeft
  
  let squaresAvailableDown = squares[currentPieceSquare].row;

  if (squaresAvailableRight <= squaresAvailableDown) {
    numberOfSquaresAvailable = squaresAvailableRight;
  } else {
    numberOfSquaresAvailable = squaresAvailableDown;
  }

  threatScore += getDiagonalThreatScore(board, piece, CONSTANTS.downRight, numberOfSquaresAvailable); // downRight
  
  
  if (squaresAvailableLeft <= squaresAvailableDown) {
    numberOfSquaresAvailable = squaresAvailableLeft;
  } else {
    numberOfSquaresAvailable = squaresAvailableDown;
  }

  threatScore += getDiagonalThreatScore(board, piece, CONSTANTS.downLeft, numberOfSquaresAvailable); // downLeft  
  return threatScore;
}

/**
 * 
 * @param {*} piece 
 * @param {*} diagonal upright, downright, upleft, downleft
 */
export function getDiagonalThreatScore(board, piece, diagonal, numberOfSquaresAvailable) {

    const currentPieceSquare = piece.currentSquare;

    let threatScore = 0;

    for (let i = 1; i <= numberOfSquaresAvailable; i++) { // upleft
        let dst = currentPieceSquare + i * diagonal;
    
        if (board[dst].piece === null) continue;
    
        if (board[dst].piece.white === true) {
          // get the threat score
          let value = board[dst].piece.value;
          threatScore += value;
          break; // end this diagonal scanning
        }
      }
    return threatScore;
}

// returns the threat score that this piece causes threat to the opponent
// e.g. if a black pawn threats both white pawn and white knight, the threat score will be 1 + 3 = 4
export function getBlackPieceThreatScore(piece) {
    
  const value = piece.value;
  let threatScore = 0;
  switch (value) {
    case CONSTANTS.WHITE_PAWN_CODE:

      threatScore += getBlackPawnThreatScore(piece);

      break;
    case CONSTANTS.WHITE_KNIGHT_CODE:
      //

      break;
    case CONSTANTS.WHITE_BISHOP_CODE:
      //
      break;
    case CONSTANTS.WHITE_ROOK_CODE:
      //
      break;
    case CONSTANTS.WHITE_KING_CODE:
      //
      break;
    case CONSTANTS.WHITE_QUEEN_CODE:
      //
      break;
    default:
      break;
  }
  return threatScore;
}
