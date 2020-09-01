import React from "react";
//import CONSTANTS from "../config/constants";

class Moves extends React.Component {
  /*
  constructor(props) {
    super(props);
    this.state = {
    }
  }
*/

/*  getCandidateWhiteKingMoves(piece, squares) {
    const DLM = CONSTANTS.defaultDelim;
    let candidateMoves = [];
    let pos = piece.currentSquare; // ensure this is dealt as an integer!

    let up = pos + CONSTANTS.up;
    let down = pos + CONSTANTS.down;
    let left = pos + CONSTANTS.left;
    let right = pos + CONSTANTS.right;
    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;
    let upLeft = pos + CONSTANTS.upLeft;
    let upRight = pos + CONSTANTS.upRight;

    if (squares[pos].row < CONSTANTS.maxRow) {
      // needs to stay on the board limits
      if (squares[up].piece == null || squares[up].piece.white === false) {
        candidateMoves.push(pos + DLM + up);
      }
    }

    if (squares[pos].row > CONSTANTS.minRow) {
      // needs to stay on the board limits
      if (squares[down].piece == null || squares[down].piece.white === false) {
        candidateMoves.push(pos + DLM + down);
      }
    }

    if (squares[pos].col > CONSTANTS.minCol) {
      // needs to stay on the board limits
      if (squares[left].piece == null || squares[left].piece.white === false) {
        candidateMoves.push(pos + DLM + left);
      }
    }

    if (squares[pos].col < CONSTANTS.maxCol) {
      // needs to stay on the board limits
      if (
        squares[right].piece == null ||
        squares[right].piece.white === false
      ) {
        candidateMoves.push(pos + DLM + right);
      }
    }

    if (
      squares[pos].row < CONSTANTS.maxRow &&
      squares[pos].col < CONSTANTS.maxCol
    ) {
      // needs to stay on the board limits
      if (
        squares[upRight].piece == null ||
        squares[upRight].piece.white === false
      ) {
        candidateMoves.push(pos + DLM + upRight);
      }
    }

    if (
      squares[pos].row > CONSTANTS.minRow &&
      squares[pos].col < CONSTANTS.maxCol
    ) {
      // needs to stay on the board limits
      if (
        squares[downRight].piece == null ||
        squares[downRight].piece.white === false
      ) {
        candidateMoves.push(pos + DLM + downRight);
      }
    }

    if (
      squares[pos].row < CONSTANTS.maxRow &&
      squares[pos].col > CONSTANTS.minCol
    ) {
      // needs to stay on the board limits
      if (
        squares[upLeft].piece == null ||
        squares[upLeft].piece.white === false
      ) {
        candidateMoves.push(pos + DLM + upLeft);
      }
    }

    if (
      squares[pos].row > CONSTANTS.minRow &&
      squares[pos].col > CONSTANTS.minCol
    ) {
      // needs to stay on the board limits
      if (
        squares[downLeft].piece == null ||
        squares[downLeft].piece.white === false
      ) {
        candidateMoves.push(pos + DLM + downLeft);
      }
    }

    return candidateMoves;
  }

  getCandidateBlacKingMoves(piece, squares) {
    const DLM = CONSTANTS.defaultDelim;
    let candidateMoves = [];
    let pos = piece.currentSquare;

    let up = pos + CONSTANTS.up;
    let down = pos + CONSTANTS.down;
    let left = pos + CONSTANTS.left;
    let right = pos + CONSTANTS.right;
    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;
    let upLeft = pos + CONSTANTS.upLeft;
    let upRight = pos + CONSTANTS.upRight;

    if (squares[pos].row < CONSTANTS.maxRow) {
      // needs to stay on the board limits
      if (squares[up].piece === null || squares[up].piece.white === true) {
        candidateMoves.push(pos + DLM + up);
      }
    }

    if (squares[pos].row > CONSTANTS.minRow) {
      // needs to stay on the board limits
      if (squares[down].piece === null || squares[down].piece.white === true) {
        candidateMoves.push(pos + DLM + down);
      }
    }

    if (squares[pos].col > CONSTANTS.minCol) {
      // needs to stay on the board limits
      if (squares[left].piece === null || squares[left].piece.white === true) {
        candidateMoves.push(pos + DLM + left);
      }
    }

    if (squares[pos].col < CONSTANTS.maxCol) {
      // needs to stay on the board limits
      if (
        squares[right].piece === null ||
        squares[right].piece.white === true
      ) {
        candidateMoves.push(pos + DLM + right);
      }
    }

    if (
      squares[pos].row < CONSTANTS.maxRow &&
      squares[pos].col < CONSTANTS.maxCol
    ) {
      // needs to stay on the board limits
      if (
        squares[upRight].piece === null ||
        squares[upRight].piece.white === true
      ) {
        candidateMoves.push(pos + DLM + upRight);
      }
    }

    if (
      squares[pos].row > CONSTANTS.minRow &&
      squares[pos].col < CONSTANTS.maxCol
    ) {
      // needs to stay on the board limits
      if (
        squares[downRight].piece === null ||
        squares[downRight].piece.white === true
      ) {
        candidateMoves.push(pos + DLM + downRight);
      }
    }

    if (
      squares[pos].row < CONSTANTS.maxRow &&
      squares[pos].col > CONSTANTS.minCol
    ) {
      // needs to stay on the board limits
      if (
        squares[upLeft].piece === null ||
        squares[upLeft].piece.white === true
      ) {
        candidateMoves.push(pos + DLM + upLeft);
      }
    }

    if (
      squares[pos].row > CONSTANTS.minRow &&
      squares[pos].col > CONSTANTS.minCol
    ) {
      // needs to stay on the board limits
      if (
        squares[downLeft].piece === null ||
        squares[downLeft].piece.white === true
      ) {
        candidateMoves.push(pos + DLM + downLeft);
      }
    }

    return candidateMoves;
  }

  // en passe -> former position (former from move)

  getCandidateWhitePawnMoves(piece, board, prevMove) {
    const CURRENT_PIECE_SQUARE = piece.currentSquare;

    const DELIMITER = CONSTANTS.defaultDelim;
    const DOWN = CURRENT_PIECE_SQUARE + CONSTANTS.down;
    const DOWN2 = CURRENT_PIECE_SQUARE + CONSTANTS.down2;
    const DOWN_LEFT = CURRENT_PIECE_SQUARE + CONSTANTS.downLeft;
    const DOWN_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.downRight;

    let candidateMoves = [];

    if (DOWN < 0 || DOWN_RIGHT < 0 || DOWN_LEFT < 0) return candidateMoves;
    if (board[DOWN].piece === null && DOWN <= 7) {
      // promotion -> DOWN & DOWNLEFT & DOWNRIGHT
      this.addWhitePromotion(candidateMoves, CURRENT_PIECE_SQUARE, DOWN);
    } else if (
      DOWN_RIGHT <= 7 &&
      board[DOWN_RIGHT].piece !== null &&
      board[DOWN_RIGHT].piece.white === false
    ) {
      // promotion by eating
      this.addWhitePromotion(candidateMoves, CURRENT_PIECE_SQUARE, DOWN_RIGHT);
    } else if (
      DOWN_LEFT <= 7 &&
      board[DOWN_LEFT].piece !== null &&
      board[DOWN_LEFT].piece.white === false
    ) {
      this.addWhitePromotion(candidateMoves, CURRENT_PIECE_SQUARE, DOWN_LEFT);
    } else if (
      board[DOWN].piece === null &&
      board[CURRENT_PIECE_SQUARE].row > CONSTANTS.minRow
    ) {
      candidateMoves.push(CURRENT_PIECE_SQUARE + DELIMITER + DOWN);

      if (
        board[CURRENT_PIECE_SQUARE].row === CONSTANTS.whitePawnInitialRow &&
        board[DOWN2].piece === null
      ) {
        // hasn't moved yet, double pawn front
        candidateMoves.push(CURRENT_PIECE_SQUARE + DELIMITER + DOWN2);
      }
    }

    if (
      board[CURRENT_PIECE_SQUARE].col > 7 &&
      board[DOWN_LEFT].piece !== null &&
      board[DOWN_LEFT].piece.white === false
    ) {
      // eat black
      candidateMoves.push(CURRENT_PIECE_SQUARE + DELIMITER + DOWN_LEFT); // eats black piece
    }
    if (
      board[CURRENT_PIECE_SQUARE].col < CONSTANTS.maxCol &&
      board[DOWN_RIGHT].piece !== null &&
      board[DOWN_RIGHT].piece.white === false
    ) {
      // right up eat black
      candidateMoves.push(CURRENT_PIECE_SQUARE + DELIMITER + DOWN_RIGHT); // eats black piece
    }

    if (
      board[CURRENT_PIECE_SQUARE].row ===
      CONSTANTS.whitePawnInThisRowCanCaptureWithEnPassant
    ) {
      const RIGHT_PIECE = board[CURRENT_PIECE_SQUARE + CONSTANTS.right].piece;
      const LEFT_PIECE = board[CURRENT_PIECE_SQUARE + CONSTANTS.left].piece;

      if (
        RIGHT_PIECE !== null &&
        RIGHT_PIECE.value === CONSTANTS.BLACK_PAWN_CODE
      ) {
        const DST = CURRENT_PIECE_SQUARE + CONSTANTS.right;
        const SRC = DST + CONSTANTS.down2;
        const PREVIOUS_BLACK_PAWN_MOVE = SRC + DELIMITER + DST;

        if (this.state.prevMove === PREVIOUS_BLACK_PAWN_MOVE) {
          // en passant
          const DOWN_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.downRight;
          candidateMoves.push(
            CURRENT_PIECE_SQUARE + CONSTANTS.EN_PASSANT + DOWN_RIGHT
          );
        }
      } else if (
        LEFT_PIECE !== null &&
        LEFT_PIECE.value === CONSTANTS.BLACK_PAWN_CODE
      ) {
        const dst = CURRENT_PIECE_SQUARE + CONSTANTS.left;
        const src = dst + CONSTANTS.down2;
        const tmp = src + DELIMITER + dst;

        if (prevMove === tmp) {
          const downLeft = CURRENT_PIECE_SQUARE + CONSTANTS.downLeft;
          candidateMoves.push(
            CURRENT_PIECE_SQUARE + CONSTANTS.EN_PASSANT + downLeft
          ); // en passe black pawn; P for en passe
        }
      }
    }
    return candidateMoves;
  }

  addWhitePromotion(candidateMoves, currentSquare, promotionDirection) {
    candidateMoves.push(
      currentSquare + CONSTANTS.PROMOTION_TO_QUEEN + promotionDirection
    );
    candidateMoves.push(
      currentSquare + CONSTANTS.PROMOTION_TO_ROOK + promotionDirection
    ); // underpromotion to rook
    candidateMoves.push(
      currentSquare + CONSTANTS.PROMOTION_TO_BISHOP + promotionDirection
    ); // underpromotion to bishop
    candidateMoves.push(
      currentSquare + CONSTANTS.PROMOTION_TO_KNIGHT + promotionDirection
    ); // underpromotion to knight
  }

  getCandidateBlackPawnMoves(piece, board, prevMove) {
    const DELIMITER = CONSTANTS.defaultDelim;
    const currentPieceSquare = piece.currentSquare; // ensure this is a number

    let up = currentPieceSquare + CONSTANTS.up;
    let up2 = currentPieceSquare + CONSTANTS.up2;
    let upLeft = currentPieceSquare + CONSTANTS.upLeft;
    let upRight = currentPieceSquare + CONSTANTS.upRight;

    let candidateMoves = [];

    if (
      board[up].piece === null &&
      board[currentPieceSquare].row < CONSTANTS.maxRow
    ) {
      candidateMoves.push(currentPieceSquare + DELIMITER + up); // one up

      if (
        board[currentPieceSquare].row === CONSTANTS.blackPawnInitialRow &&
        board[up2].piece === null
      ) {
        // hasn't moved yet, double pawn front
        candidateMoves.push(currentPieceSquare + DELIMITER + up2);
      }
    }
    if (
      board[currentPieceSquare].col > CONSTANTS.minCol &&
      board[upLeft].piece !== null &&
      board[upLeft].piece.white === true
    ) {
      // eat white
      candidateMoves.push(currentPieceSquare + DELIMITER + upLeft);
    }
    if (
      board[currentPieceSquare].col < CONSTANTS.maxCol &&
      board[upRight].piece !== null &&
      board[upRight].piece.white === true
    ) {
      // right up eat white
      candidateMoves.push(currentPieceSquare + DELIMITER + upRight);
    }

    if (
      board[currentPieceSquare].row ===
      CONSTANTS.blackPawnInThisRowCanCaptureWithEnPassant
    ) {
      const rightPiece = board[currentPieceSquare + CONSTANTS.right].piece;
      const leftPiece = board[currentPieceSquare + CONSTANTS.left].piece;

      if (rightPiece !== null && rightPiece.value === CONSTANTS.WHITE_PA) {
        const dst = currentPieceSquare + CONSTANTS.right;
        const src = dst + CONSTANTS.up2;
        const previousWhitePawnMove = src + DELIMITER + dst;

        if (this.state.prevMove === previousWhitePawnMove) {
          const upRight = currentPieceSquare + CONSTANTS.upRight;
          candidateMoves.push(
            currentPieceSquare + CONSTANTS.EN_PASSANT + upRight
          );
          console.error("en passant check allowed...");
        }
      } else if (
        leftPiece !== null &&
        leftPiece.value === CONSTANTS.WHITE_PAWN_CODE
      ) {
        const dst = currentPieceSquare + CONSTANTS.left;
        const src = dst + CONSTANTS.up2;
        const tmp = src + DELIMITER + dst;

        if (prevMove === tmp) {
          const upLeft = currentPieceSquare + CONSTANTS.upLeft;
          candidateMoves.push(
            currentPieceSquare + CONSTANTS.EN_PASSANT + upLeft
          ); // en passe black pawn; P for en passe
        }
      }
    }
    return candidateMoves;
  }

  getCandidateKnightMoves(piece, board) {
    const CURRENT_PIECE_SQUARE = piece.currentSquare;
    const DLM = CONSTANTS.defaultDelim;
    const CHECK = CONSTANTS.CHECK;

    const TWO_RIGHT_ONE_UP = CURRENT_PIECE_SQUARE + CONSTANTS.twoRightOneUp;
    const TWO_RIGHT_ONE_DOWN = CURRENT_PIECE_SQUARE + CONSTANTS.twoRightOneDown;
    const TWO_UP_ONE_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.twoUpOneRight;
    const TWO_UP_ONE_LEFT = CURRENT_PIECE_SQUARE + CONSTANTS.twoUpOneLeft;
    const TWO_LEFT_ONE_UP = CURRENT_PIECE_SQUARE + CONSTANTS.twoLeftOneUp;
    const TWO_LEFT_ONE_DOWN = CURRENT_PIECE_SQUARE + CONSTANTS.twoLeftOneDown;
    const TWO_DOWN_ONE_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.twoDownOneRight;
    const TWO_DOWN_ONE_LEFT = CURRENT_PIECE_SQUARE + CONSTANTS.twoDownOneLeft;

    let candidateMoves = [];

    if (
      board[CURRENT_PIECE_SQUARE].row <= 6 &&
      board[CURRENT_PIECE_SQUARE].col <= 5
    ) {
      // check that the move stays on the board
      if (
        board[TWO_RIGHT_ONE_UP].piece === null ||
        board[TWO_RIGHT_ONE_UP].piece.white !== piece.white
      ) {
        if (
          board[TWO_RIGHT_ONE_UP].piece !== null &&
          ((piece.white && board[TWO_RIGHT_ONE_UP].piece.value === -6) ||
            (!piece.white && board[TWO_RIGHT_ONE_UP].piece.value === 6))
        ) {
          candidateMoves.push(CURRENT_PIECE_SQUARE + CHECK + TWO_RIGHT_ONE_UP);
          console.error("CHECK DETECTED!!");
        } else {
          candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_RIGHT_ONE_UP);
        }
      }
    }

    // 2 right, 1 down
    if (
      board[CURRENT_PIECE_SQUARE].row >= 1 &&
      board[CURRENT_PIECE_SQUARE].col <= 5
    ) {
      // check that the move stays on the board

      if (
        board[TWO_RIGHT_ONE_DOWN].piece === null ||
        board[TWO_RIGHT_ONE_DOWN].piece.white !== piece.white
      ) {
        if (
          board[TWO_RIGHT_ONE_DOWN].piece !== null &&
          ((piece.white && board[TWO_RIGHT_ONE_DOWN].piece.value === -6) ||
            (!piece.white && board[TWO_RIGHT_ONE_DOWN].piece.value === 6))
        ) {
          candidateMoves.push(
            CURRENT_PIECE_SQUARE + CHECK + TWO_RIGHT_ONE_DOWN
          );
        } else {
          candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_RIGHT_ONE_DOWN);
        }
      }
    }

    // 2 up, 1 right

    if (
      board[CURRENT_PIECE_SQUARE].row <= 5 &&
      board[CURRENT_PIECE_SQUARE].col <= 6
    ) {
      if (
        board[TWO_UP_ONE_RIGHT].piece === null ||
        board[TWO_UP_ONE_RIGHT].piece.white !== piece.white
      ) {
        candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_UP_ONE_RIGHT);
      }
    }

    if (
      board[CURRENT_PIECE_SQUARE].row <= 5 &&
      board[CURRENT_PIECE_SQUARE].col >= 1
    ) {
      if (
        board[TWO_UP_ONE_LEFT].piece === null ||
        board[TWO_UP_ONE_LEFT].piece.white !== piece.white
      ) {
        candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_UP_ONE_LEFT);
      }
    }

    if (
      board[CURRENT_PIECE_SQUARE].row <= 6 &&
      board[CURRENT_PIECE_SQUARE].col >= 2
    ) {
      if (
        board[TWO_LEFT_ONE_UP].piece === null ||
        board[TWO_LEFT_ONE_UP].piece.white !== piece.white
      ) {
        candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_LEFT_ONE_UP);
      }
    }

    if (
      board[CURRENT_PIECE_SQUARE].row >= 1 &&
      board[CURRENT_PIECE_SQUARE].col >= 2
    ) {
      if (
        board[TWO_LEFT_ONE_DOWN].piece === null ||
        board[TWO_LEFT_ONE_DOWN].piece.white !== piece.white
      ) {
        candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_LEFT_ONE_DOWN);
      }
    }

    if (
      board[CURRENT_PIECE_SQUARE].row >= 2 &&
      board[CURRENT_PIECE_SQUARE].col <= 6
    ) {
      if (
        board[TWO_DOWN_ONE_RIGHT].piece === null ||
        board[TWO_DOWN_ONE_RIGHT].piece.white !== piece.white
      ) {
        candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_DOWN_ONE_RIGHT);
      }
    }

    if (
      board[CURRENT_PIECE_SQUARE].row >= 2 &&
      board[CURRENT_PIECE_SQUARE].col >= 1
    ) {
      if (
        board[TWO_DOWN_ONE_LEFT].piece === null ||
        board[TWO_DOWN_ONE_LEFT].piece.white !== piece.white
      ) {
        candidateMoves.push(CURRENT_PIECE_SQUARE + DLM + TWO_DOWN_ONE_LEFT);
      }
    }
    return candidateMoves;
  }

  isAllowedByOpponentKnight(piece, kingPosition) {
    const CURRENT_PIECE_SQUARE = piece.currentSquare;
    const TWO_RIGHT_ONE_UP = CURRENT_PIECE_SQUARE + CONSTANTS.twoRightOneUp;
    const TWO_RIGHT_ONE_DOWN = CURRENT_PIECE_SQUARE + CONSTANTS.twoRightOneDown;
    const TWO_UP_ONE_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.twoUpOneRight;
    const TWO_UP_ONE_LEFT = CURRENT_PIECE_SQUARE + CONSTANTS.twoUpOneLeft;
    const TWO_LEFT_ONE_UP = CURRENT_PIECE_SQUARE + CONSTANTS.twoLeftOneUp;
    const TWO_LEFT_ONE_DOWN = CURRENT_PIECE_SQUARE + CONSTANTS.twoLeftOneDown;
    const TWO_DOWN_ONE_RIGHT = CURRENT_PIECE_SQUARE + CONSTANTS.twoDownOneRight;
    const TWO_DOWN_ONE_LEFT = CURRENT_PIECE_SQUARE + CONSTANTS.twoDownOneLeft;

    if (TWO_RIGHT_ONE_UP === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    if (TWO_RIGHT_ONE_DOWN === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    if (TWO_UP_ONE_RIGHT === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    if (TWO_UP_ONE_LEFT === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    if (TWO_LEFT_ONE_UP === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    if (TWO_LEFT_ONE_DOWN === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    if (TWO_DOWN_ONE_RIGHT === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    if (TWO_DOWN_ONE_LEFT === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }
    return true;
  }

  isAllowedByOpponentBlackPawn(piece, kingPosition) {
    const pos = piece.currentSquare; // ensure this is a number

    const upLeft = pos + CONSTANTS.upLeft;
    const upRight = pos + CONSTANTS.upRight;
    if (upLeft === kingPosition) return false;
    if (upRight === kingPosition) return false;

    return true;
  }

  isAllowedByOpponentWhitePawn(piece, kingPosition) {
    const DOWN_LEFT = piece.currentSquare + CONSTANTS.downLeft;
    const DOWN_RIGHT = piece.currentSquare + CONSTANTS.downRight;

    if (DOWN_LEFT === kingPosition) return false;
    if (DOWN_RIGHT === kingPosition) return false;

    return true;
  }

  getCandidateBishopMoves(piece, board) {
    let candidateMoves = [];
    candidateMoves = this.getCandidateDiagonalMovesUpRight(
      piece,
      board,
      candidateMoves
    );
    candidateMoves = this.getCandidateDiagonalMovesUpLeft(
      piece,
      board,
      candidateMoves
    );
    candidateMoves = this.getCandidateDiagonalMovesDownLeft(
      piece,
      board,
      candidateMoves
    );
    candidateMoves = this.getCandidateDiagonalMovesDownRight(
      piece,
      board,
      candidateMoves
    );
    return candidateMoves;
  }

  getCandidateDiagonalMovesUpRight(piece, board, candidateMoves) {
    const DLM = CONSTANTS.defaultDelim;
    const currentPieceSquare = piece.currentSquare;

    const squaresAvailableRight =
      CONSTANTS.maxCol - board[currentPieceSquare].col;
    const squaresAvailableUp = CONSTANTS.maxRow - board[currentPieceSquare].row;

    let numberOfSquaresAvailable;

    if (squaresAvailableRight <= squaresAvailableUp) {
      numberOfSquaresAvailable = squaresAvailableRight;
    } else {
      numberOfSquaresAvailable = squaresAvailableUp;
    }

    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = currentPieceSquare + i * CONSTANTS.upRight;

      if (board[dst].piece === null) {
        candidateMoves.push(currentPieceSquare + DLM + dst);
      } else if (board[dst].piece.white !== piece.white) {
        candidateMoves.push(currentPieceSquare + DLM + dst); // eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    //console.log('up right moves =' + candidateMoves.length);
    return candidateMoves;
  }

  getCandidateDiagonalMovesUpLeft(piece, squares, candidateMoves) {
    const DLM = CONSTANTS.defaultDelim;
    let pos = piece.currentSquare;

    const squaresAvailableLeft = squares[pos].col;
    const squaresAvailableUp = CONSTANTS.maxRow - squares[pos].row;

    let numberOfSquaresAvailable;

    if (squaresAvailableLeft <= squaresAvailableUp) {
      numberOfSquaresAvailable = squaresAvailableLeft;
    } else {
      numberOfSquaresAvailable = squaresAvailableUp;
    }

    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + i * CONSTANTS.upLeft;

      if (squares[dst].piece === null) {
        candidateMoves.push(pos + DLM + dst);
      } else if (squares[dst].piece.white !== piece.white) {
        candidateMoves.push(pos + DLM + dst); // eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    //console.log('up left moves ='+candidateMoves.length);
    return candidateMoves;
  }

  getCandidateDiagonalMovesDownRight(piece, squares, candidateMoves) {
    const DLM = CONSTANTS.defaultDelim;
    let pos = piece.currentSquare;

    let squaresAvailableRight = CONSTANTS.maxCol - squares[pos].col;
    let squaresAvailableDown = squares[pos].row;

    let numberOfSquaresAvailable;

    if (squaresAvailableRight <= squaresAvailableDown) {
      numberOfSquaresAvailable = squaresAvailableRight;
    } else {
      numberOfSquaresAvailable = squaresAvailableDown;
    }

    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + i * CONSTANTS.downRight;

      if (squares[dst].piece === null) {
        candidateMoves.push(pos + DLM + dst);
      } else if (squares[dst].piece.white !== piece.white) {
        candidateMoves.push(pos + DLM + dst); // eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }
    //console.log('down right moves ='+ candidateMoves.length);
    return candidateMoves;
  }

  getCandidateDiagonalMovesDownLeft(piece, squares, candidateMoves) {
    const DLM = CONSTANTS.defaultDelim;
    let pos = piece.currentSquare;

    let squaresAvailableLeft = squares[pos].col;
    let squaresAvailableDown = squares[pos].row;

    let numberOfSquaresAvailable;

    if (squaresAvailableLeft <= squaresAvailableDown) {
      numberOfSquaresAvailable = squaresAvailableLeft;
    } else {
      numberOfSquaresAvailable = squaresAvailableDown;
    }

    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + i * CONSTANTS.downLeft;

      if (squares[dst].piece === null) {
        candidateMoves.push(pos + DLM + dst);
      } else if (squares[dst].piece.white !== piece.white) {
        candidateMoves.push(pos + DLM + dst); // eat opponent's piece
        break;
      } else {
        break; // own piece
      }
    }

    return candidateMoves;
  }

  getCandidateRookMoves(piece, squares) {
    const DLM = CONSTANTS.defaultDelim;
    let pos = piece.currentSquare;

    let candidateMoves = [];
    let UP = pos + CONSTANTS.up;
    let DOWN = pos + CONSTANTS.down;
    let LEFT = pos + CONSTANTS.left;
    let RIGHT = pos + CONSTANTS.right;

    // move UP
    for (let i = UP; i <= CONSTANTS.maxWhite; i += CONSTANTS.up) {
      if (squares[i].piece === null) {
        candidateMoves.push(pos + DLM + i);
      } else if (squares[i].piece === undefined) {
        candidateMoves.push(pos + DLM + i);
      } else if (piece.white !== squares[i].piece.white) {
        // eat
        candidateMoves.push(pos + DLM + i);
        break; // no more move possibilities after eating
      } else {
        break; // own piece blocks
      }
    }

    // move DOWN
    for (let i = DOWN; i >= 0; i += CONSTANTS.down) {
      if (squares[i].piece === null) {
        candidateMoves.push(pos + DLM + i);
      } else if (piece.white !== squares[i].piece.white) {
        // eat
        candidateMoves.push(pos + DLM + i); // FIXME: # could be changed to X for eating
        break; // no more move possibilities after eating
      } else break; // own piece
    }

    // move RIGHT
    let movesRight = CONSTANTS.maxCol - squares[pos].col;

    for (let i = RIGHT; i <= movesRight + pos; i++) {
      if (squares[i].piece === null) {
        candidateMoves.push(pos + DLM + i);
      } else if (piece.white !== squares[i].piece.white) {
        // eat
        candidateMoves.push(pos + DLM + i);
        break; // no more move possibilities after eating
      } else break; // own piece
    }

    // move LEFT
    let movesLeft = squares[pos].col;

    for (let i = LEFT; i >= pos - movesLeft; i--) {
      if (squares[i].piece === null) {
        candidateMoves.push(pos + DLM + i);
      } else if (piece.white !== squares[i].piece.white) {
        // eat
        candidateMoves.push(pos + DLM + i);
        break; // no more move possibilities after eating
      } else break; // own piece
    }
    return candidateMoves;
  }

  isAllowedByOpponentQueen(
    piece,
    squares,
    kingPosition,
    opponentCandidateMove
  ) {
    let allowed = true;
    const pos = piece.currentSquare;
    if (pos < 0) return allowed; // ignore to-be-promoted extra pieces

    allowed = this.isAllowedByOpponentRook(
      piece,
      squares,
      kingPosition,
      opponentCandidateMove
    );

    if (!allowed) return false;

    allowed = this.isAllowedByOpponentBishop(
      piece,
      squares,
      kingPosition,
      opponentCandidateMove
    );

    return allowed;
  }

  isAllowedByOpponentKing(piece, kingPosition) {
    let allowed = true;
    let pos = piece.currentSquare; // ensure this is dealt as an integer!

    let up = pos + CONSTANTS.up;
    let down = pos + CONSTANTS.down;
    let left = pos + CONSTANTS.left;
    let right = pos + CONSTANTS.right;
    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;
    let upLeft = pos + CONSTANTS.upLeft;
    let upRight = pos + CONSTANTS.upRight;

    if (up === kingPosition) return false; // reject move #1
    if (down === kingPosition) return false; // reject move #2
    if (left === kingPosition) return false; // reject move #3
    if (right === kingPosition) return false; // reject move #4
    if (downRight === kingPosition) return false; // reject move #5
    if (upRight === kingPosition) return false; // reject move #6
    if (upLeft === kingPosition) return false; // reject move #7
    if (downLeft === kingPosition) return false; // reject move #8

    return allowed;
  }

  isAllowedByOpponentBishop(
    piece,
    squares,
    kingPosition,
    opponentCandidateMove
  ) {
    const DLM = CONSTANTS.defaultDelim;
    let canditSrc = 0;
    let canditDst = 0;

    let allowed = true;

    if (opponentCandidateMove !== undefined) {
      const move = opponentCandidateMove.split(DLM); // [1] === dst move
      canditDst = move[1];
      canditSrc = move[0]; // ensure that it's an integer! (*1)
    }

    allowed = this.isDiagonalMovesUpRightAllowed(
      piece,
      squares,
      kingPosition,
      canditSrc,
      canditDst
    );
    if (!allowed) return false;
    allowed = this.isDiagonalMovesUpLeftAllowed(
      piece,
      squares,
      kingPosition,
      canditSrc,
      canditDst
    );
    if (!allowed) return false;
    allowed = this.isDiagonalMovesDownLeftAllowed(
      piece,
      squares,
      kingPosition,
      canditSrc,
      canditDst
    );
    if (!allowed) return false;
    allowed = this.isDiagonalMovesDownRightAllowed(
      piece,
      squares,
      kingPosition,
      canditSrc,
      canditDst
    );

    return allowed;
  }

  isAllowedByOpponentRook(piece, squares, kingPosition, opponentCandidateMove) {
    const DLM = CONSTANTS.defaultDelim;
    let allowed = true;

    let pos = piece.currentSquare;

    let UP = pos + CONSTANTS.up;
    let DOWN = pos + CONSTANTS.down;
    let LEFT = pos + CONSTANTS.left;
    let RIGHT = pos + CONSTANTS.right;

    let canditSrc = 0;
    let canditDst = 0;

    if (opponentCandidateMove !== undefined) {
      const move = opponentCandidateMove.split(DLM); // [1] === dst move
      canditSrc = move[0];
      canditDst = move[1];
    }

    // move UP
    for (let i = UP; i <= CONSTANTS.maxWhite; i += CONSTANTS.up) {
      if (i === kingPosition) {
        return false; // this move wasn't allowed by the rook
      }
      let squarePiece = squares[i].piece;

      if (i === canditDst) {
        break;
      } else if (canditSrc === i) {
        continue;
      } else if (squarePiece !== null) {
        break; // move accepted; collides with own or eats opponent's piece; both are OK
      }
    }

    // move DOWN
    for (let i = DOWN; i >= 0; i += CONSTANTS.down) {
      if (i === kingPosition) {
        return false;
      }
      let squarePiece = squares[i].piece;

      if (i === canditDst) {
        break;
      } else if (canditSrc === i) {
        continue;
      } else if (squarePiece !== null) {
        break; // move accepted; collides with own or eats opponent's piece; both are OK
      }
    }

    // move RIGHT
    let movesRight = CONSTANTS.maxCol - squares[pos].col;

    for (let i = RIGHT; i <= movesRight + pos; i++) {
      if (i === kingPosition) {
        return false;
      }
      let squarePiece = squares[i].piece;

      if (i === canditDst) {
        break;
      } else if (canditSrc === i) {
        continue;
      } else if (squarePiece !== null) {
        break; // move accepted; collides with own or eats opponent's piece; both are OK
      }
    }

    // move LEFT
    let movesLeft = squares[pos].col;

    for (let i = LEFT; i >= pos - movesLeft; i--) {
      if (i === kingPosition) {
        return false;
      }
      let squarePiece = squares[i].piece;

      if (i === canditDst) {
        break;
      } else if (canditSrc === i) {
        continue;
      } else if (squarePiece !== null) {
        break; // move accepted; collides with own or eats opponent's piece; both are OK
      }
    }
    return allowed;
  }

  isDiagonalMovesUpRightAllowed(
    piece,
    squares,
    kingPosition,
    canditSrc,
    canditDst
  ) {
    let pos = piece.currentSquare;
    let allowed = true;

    let squaresAvailableRight = CONSTANTS.maxCol - squares[pos].col;
    let squaresAvailableUp = CONSTANTS.maxRow - squares[pos].row;

    let numberOfSquaresAvailable;

    if (squaresAvailableRight <= squaresAvailableUp) {
      numberOfSquaresAvailable = squaresAvailableRight;
    } else {
      numberOfSquaresAvailable = squaresAvailableUp;
    }

    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + i * CONSTANTS.upRight;

      if (dst === kingPosition) {
        return false; // move cannot be accepted (king would be eaten)
      } else if (dst === canditDst) {
        break;
      } else if (dst === canditSrc) {
        continue; // this piece doesn't block anymore
      } else if (squares[dst].piece !== null) {
        //canditSrc can't be here!
        // own or opponent's piece
        break;
      }
    }
    return allowed;
  }

  isDiagonalMovesUpLeftAllowed(
    piece,
    squares,
    kingPosition,
    canditSrc,
    canditDst
  ) {
    let pos = piece.currentSquare;
    let allowed = true;

    const squaresAvailableLeft = squares[pos].col;
    const squaresAvailableUp = CONSTANTS.maxRow - squares[pos].row;
    let numberOfSquaresAvailable;

    if (squaresAvailableLeft <= squaresAvailableUp) {
      numberOfSquaresAvailable = squaresAvailableLeft;
    } else {
      numberOfSquaresAvailable = squaresAvailableUp;
    }

    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + i * CONSTANTS.upLeft;

      if (dst === kingPosition) {
        return false; //move cannot be accepted (king would be eaten)
      }

      if (dst === canditSrc) {
        continue;
      } else if (dst === canditDst) {
        break;
      } else if (squares[dst].piece !== null) {
        break;
      }
    }
    return allowed;
  }

  isDiagonalMovesDownRightAllowed(
    piece,
    squares,
    kingPosition,
    canditSrc,
    canditDst
  ) {
    let pos = piece.currentSquare;
    let allowed = true;

    let squaresAvailableRight = CONSTANTS.maxCol - squares[pos].col;
    let squaresAvailableDown = squares[pos].row;

    let numberOfSquaresAvailable;

    if (squaresAvailableRight <= squaresAvailableDown) {
      numberOfSquaresAvailable = squaresAvailableRight;
    } else {
      numberOfSquaresAvailable = squaresAvailableDown;
    }

    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + i * CONSTANTS.downRight;

      if (dst === kingPosition) {
        return false; //move cannot be accepted (king would be eaten)
      }

      if (dst === canditSrc) {
        continue;
      } else if (dst === canditDst) {
        break;
      } else if (squares[dst].piece !== null) {
        break;
      }
    }
    return allowed;
  }

  isDiagonalMovesDownLeftAllowed(
    piece,
    squares,
    kingPosition,
    canditSrc,
    canditDst
  ) {
    let pos = piece.currentSquare;
    let allowed = true;

    let squaresAvailableLeft = squares[pos].col;
    let squaresAvailableDown = squares[pos].row;

    let numberOfSquaresAvailable;

    if (squaresAvailableLeft <= squaresAvailableDown) {
      numberOfSquaresAvailable = squaresAvailableLeft;
    } else {
      numberOfSquaresAvailable = squaresAvailableDown;
    }

    for (let i = 1; i <= numberOfSquaresAvailable; i++) {
      let dst = pos + i * CONSTANTS.downLeft;

      if (dst === kingPosition) {
        return false;
      }
      if (dst === canditSrc) {
        continue;
      } else if (dst === canditDst) {
        break;
      } else if (squares[dst].piece !== null) {
        break;
      }
    }
    return allowed;
  }

  getCandidateQueenMoves(piece, squares) {
    let candidateMovesQueen = [];

    let candidateMovesBishop = this.getCandidateBishopMoves(piece, squares);
    let candidateMovesRook = this.getCandidateRookMoves(piece, squares);
    candidateMovesQueen = candidateMovesBishop.concat(candidateMovesRook);
    return candidateMovesQueen;
  }

  // best move strategy for white
  getBestWhiteMove(squares, allowedMovesWhite) {
    const DLM = CONSTANTS.defaultDelim;

    for (let i = 0; i < allowedMovesWhite.length; i++) {
      const move = allowedMovesWhite[i].split(DLM);
      const src = move[0];
      const dst = move[1];
      if (squares[dst] !== undefined && squares[dst].piece !== null) {
        // compare piece values, if valueable, possibly worth eating..?!, piece.value
        if (squares[src].piece.value < squares[dst].piece.value) {
          return allowedMovesWhite[i];
        }
      }
    }
    // just a random move initially, replace with point functions & heuristics
    const n = Math.floor(Math.random() * allowedMovesWhite.length);

    return allowedMovesWhite[n];
  }

  // best move strategy for black
  getBestBlackMove(squares, allowedMovesBlack) {
    const DLM = CONSTANTS.defaultDelim;

    for (let i = 0; i < allowedMovesBlack.length; i++) {
      const move = allowedMovesBlack[i].split(DLM);

      const dst = move[1];
      if (squares[dst] !== undefined && squares[dst].piece !== null) {
        // compare piece values, if valueable, possibly worth eating..?!, piece.value
        if (squares[dst].piece.value > 1) {
          return allowedMovesBlack[i];
        }
      }
    }
    const n = Math.floor(Math.random() * allowedMovesBlack.length);
    return allowedMovesBlack[n];
  }*/
}
export default Moves;