import React from "react";
import CONSTANTS from "../config/constants";

class Moves extends React.Component {
  /*
  constructor(props) {
    super(props);
    this.state = {
    }
  }
*/

  getCandidateWhiteKingMoves(piece, squares) {
    const DLM = CONSTANTS.defaultDelim;
    let candidateMoves = [];
    let pos = 1 * piece.currentSquare; // ensure this is dealt as an integer!

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
    //console.log('White king moves size = ' + candidateMoves.length);
    return candidateMoves;
  }

  getCandidateBlacKingMoves(piece, squares) {
    const DLM = CONSTANTS.defaultDelim;
    let candidateMoves = [];
    let pos = 1 * piece.currentSquare;

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
    //console.log('Black king moves size = ' + candidateMoves.length);
    return candidateMoves;
  }

  // en passe -> former position (former from move)

  getCandidateWhitePawnMoves(piece, squares, prevMove) {
    let pos = 1 * piece.currentSquare;

    const DLM = CONSTANTS.defaultDelim;
    const down = pos + CONSTANTS.down;
    let down2 = pos + CONSTANTS.down2;
    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;

    let candidateMoves = [];

    //console.log("down = " + down + " piece pos = " + pos);
    if (down < 0 || downRight < 0 || downLeft < 0) return candidateMoves;
    if (squares[down].piece === null && down <= 7) {
      // promotion -> DOWN & DOWNLEFT & DOWNRIGHT
      this.addWhitePromotion(candidateMoves, pos, down);      
    } else if (
      downRight <= 7 &&
      squares[downRight].piece !== null &&
      squares[downRight].piece.white === false
    ) {
      // promotion by eating
      this.addWhitePromotion(candidateMoves, pos, downRight);      
    } else if (
      downLeft <= 7 &&
      squares[downLeft].piece !== null &&
      squares[downLeft].piece.white === false
    ) {
      this.addWhitePromotion(candidateMoves, pos, downLeft);      
    } else if (
      squares[down].piece === null &&
      squares[pos].row > CONSTANTS.minRow
    ) {
      candidateMoves.push(pos + DLM + down);

      if (
        squares[pos].row === CONSTANTS.whitePawnInitialRow &&
        squares[down2].piece === null
      ) {
        // hasn't moved yet, double pawn front
        candidateMoves.push(pos + DLM + down2);
      }
    }

    if (
      squares[pos].col > 7 &&
      squares[downLeft].piece !== null &&
      squares[downLeft].piece.white === false
    ) {
      // eat black
      candidateMoves.push(pos + DLM + downLeft); // eats black piece
    }
    if (
      squares[pos].col < CONSTANTS.maxCol &&
      squares[downRight].piece !== null &&
      squares[downRight].piece.white === false
    ) {
      // right up eat black
      candidateMoves.push(pos + DLM + downRight); // eats black piece
    }

    if (squares[pos].row === CONSTANTS.whiteEnPasseAllowedRow) {
      const rightPiece = squares[pos + CONSTANTS.right].piece;
      const leftPiece = squares[pos + CONSTANTS.left].piece;

      if (rightPiece !== null && rightPiece.value === CONSTANTS.blackPawn) {
        const dst = pos + CONSTANTS.right;
        const src = dst + CONSTANTS.down2;
        const tmp = src + DLM + dst;

        if (this.state.prevMove === tmp) {
          const downRight = pos + CONSTANTS.upDown;
          candidateMoves.push(pos + CONSTANTS.enPassant + downRight); // en passe black pawn; P for en passe
        }
      } else if (
        leftPiece !== null &&
        leftPiece.value === CONSTANTS.blackPawn
      ) {
        const dst = pos + CONSTANTS.left;
        const src = dst + CONSTANTS.down2;
        const tmp = src + DLM + dst;

        if (prevMove === tmp) {
          const downLeft = pos + CONSTANTS.downLeft;
          candidateMoves.push(pos + CONSTANTS.enPassant + downLeft); // en passe black pawn; P for en passe
        }
      }
    }
    return candidateMoves;
  }

  addWhitePromotion(candidateMoves, currentSquare, promotionDirection) {
    candidateMoves.push(
      currentSquare + CONSTANTS.promotionToQueen + promotionDirection
    );
    candidateMoves.push(
      currentSquare + CONSTANTS.promotionToRook + promotionDirection
    ); // underpromotion to rook
    candidateMoves.push(
      currentSquare + CONSTANTS.promotionToBishop + promotionDirection
    ); // underpromotion to bishop
    candidateMoves.push(
      currentSquare + CONSTANTS.promotionToKnight + promotionDirection
    ); // underpromotion to knight
  }

  getCandidateBlackPawnMoves(piece, squares, prevMove) {
    const DLM = CONSTANTS.defaultDelim;
    const pos = 1 * piece.currentSquare; // ensure this is a number

    let up = pos + CONSTANTS.up;
    let up2 = pos + CONSTANTS.up2;
    let upLeft = pos + CONSTANTS.upLeft;
    let upRight = pos + CONSTANTS.upRight;

    let candidateMoves = [];

    if (squares[up].piece === null && squares[pos].row < CONSTANTS.maxRow) {
      candidateMoves.push(pos + DLM + up);

      if (
        squares[pos].row === CONSTANTS.blackPawnInitialRow &&
        squares[up2].piece === null
      ) {
        // hasn't moved yet, double pawn front
        candidateMoves.push(pos + DLM + up2);
      }
    }
    if (
      squares[pos].col > CONSTANTS.minCol &&
      squares[upLeft].piece !== null &&
      squares[upLeft].piece.white === true
    ) {
      // eat white
      candidateMoves.push(pos + DLM + upLeft);
    }
    if (
      squares[pos].col < CONSTANTS.maxCol &&
      squares[upRight].piece !== null &&
      squares[upRight].piece.white === true
    ) {
      // right up eat white
      candidateMoves.push(pos + DLM + upRight);
    }

    if (squares[pos].row === CONSTANTS.blackEnPasseAllowedRow) {
      const rightPiece = squares[pos + CONSTANTS.right].piece;
      const leftPiece = squares[pos + CONSTANTS.left].piece;

      if (rightPiece !== null && rightPiece.value === CONSTANTS.whitePawn) {
        const dst = pos + CONSTANTS.right;
        const src = dst + CONSTANTS.up2;
        const tmp = src + DLM + dst;

        if (this.state.prevMove === tmp) {
          const upRight = pos + CONSTANTS.upRight;
          candidateMoves.push(pos + CONSTANTS.enPassant + upRight); // en passe black pawn; P for en passe
        }
      } else if (
        leftPiece !== null &&
        leftPiece.value === CONSTANTS.whitePawn
      ) {
        const dst = pos + CONSTANTS.left;
        const src = dst + CONSTANTS.up2;
        const tmp = src + DLM + dst;

        if (prevMove === tmp) {
          const upLeft = pos + CONSTANTS.upLeft;
          candidateMoves.push(pos + CONSTANTS.enPassant + upLeft); // en passe black pawn; P for en passe
        }
      }
    }
    return candidateMoves;
  }

  getCandidateKnightMoves(piece, squares) {
    const pos = 1 * piece.currentSquare;
    const DLM = CONSTANTS.defaultDelim;
    let candidateMoves = [];

    // 2 right, 1 up
    const rightUp = pos + CONSTANTS.twoRightOneUp;

    if (squares[pos].row <= 6 && squares[pos].col <= 5) {
      // check that the move stays on the board
      if (
        squares[rightUp].piece === null ||
        squares[rightUp].piece.white !== piece.white
      ) {
        candidateMoves.push(pos + DLM + rightUp);
      }
    }
    // 2 right, 1 down
    let rightDown = pos + CONSTANTS.twoRightOneDown;

    if (squares[pos].row >= 1 && squares[pos].col <= 5) {
      // check that the move stays on the board
      if (
        squares[rightDown].piece === null ||
        squares[rightDown].piece.white !== piece.white
      ) {
        candidateMoves.push(pos + DLM + rightDown);
      }
    }

    // 2 up, 1 right
    let upRight = pos + CONSTANTS.twoUpOneRight;

    if (squares[pos].row <= 5 && squares[pos].col <= 6) {
      if (
        squares[upRight].piece === null ||
        squares[upRight].piece.white !== piece.white
      ) {
        candidateMoves.push(pos + DLM + upRight);
      }
    }
    // 2 up, 1 left
    let upLeft = pos + CONSTANTS.twoUpOneLeft;

    if (squares[pos].row <= 5 && squares[pos].col >= 1) {
      if (
        squares[upLeft].piece === null ||
        squares[upLeft].piece.white !== piece.white
      ) {
        candidateMoves.push(pos + DLM + upLeft);
      }
    }
    // 2 left, 1 up
    let leftUp = pos + CONSTANTS.twoLeftOneUp;

    if (squares[pos].row <= 6 && squares[pos].col >= 2) {
      if (
        squares[leftUp].piece === null ||
        squares[leftUp].piece.white !== piece.white
      ) {
        candidateMoves.push(pos + DLM + leftUp);
      }
    }

    // 2 left, 1 down
    let leftDown = pos + CONSTANTS.twoLeftOneDown;

    if (squares[pos].row >= 1 && squares[pos].col >= 2) {
      if (
        squares[leftDown].piece === null ||
        squares[leftDown].piece.white !== piece.white
      ) {
        candidateMoves.push(pos + DLM + leftDown);
      }
    }
    // 2 down, 1 right
    let downRight = pos + CONSTANTS.twoDownOneRight;

    if (squares[pos].row >= 2 && squares[pos].col <= 6) {
      if (
        squares[downRight].piece === null ||
        squares[downRight].piece.white !== piece.white
      ) {
        candidateMoves.push(pos + DLM + downRight);
      }
    }
    // 2 down, 1 left
    let downLeft = pos + CONSTANTS.twoDownOneLeft;

    if (squares[pos].row >= 2 && squares[pos].col >= 1) {
      if (
        squares[downLeft].piece === null ||
        squares[downLeft].piece.white !== piece.white
      ) {
        candidateMoves.push(pos + DLM + downLeft);
      }
    }
    return candidateMoves;
  }

  isAllowedByOpponentKnight(piece, kingPosition) {
    const pos = 1 * piece.currentSquare;

    // 2 right, 1 up
    const rightUp = pos + CONSTANTS.twoRightOneUp;
    const allowed = true;

    if (rightUp === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    // 2 right, 1 down
    const rightDown = pos + CONSTANTS.twoRightOneDown;
    if (rightDown === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    // 2 up, 1 right
    const upRight = pos + CONSTANTS.twoUpOneRight;
    if (upRight === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    // 2 up, 1 left
    const upLeft = pos + CONSTANTS.twoUpOneLeft;
    if (upLeft === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    // 2 left, 1 up
    const leftUp = pos + CONSTANTS.twoLeftOneUp;

    if (leftUp === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    // 2 left, 1 down
    const leftDown = pos + CONSTANTS.twoLeftOneDown;
    if (leftDown === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    // 2 down, 1 right
    const downRight = pos + CONSTANTS.twoDownOneRight;
    if (downRight === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }

    // 2 down, 1 left
    const downLeft = pos + CONSTANTS.twoDownOneLeft;
    if (downLeft === kingPosition) {
      return false; // move cannot be accepted (king would be eaten)
    }
    return allowed;
  }

  isAllowedByOpponentBlackPawn(piece, kingPosition) {
    const allowed = true;

    const pos = 1 * piece.currentSquare; // ensure this is a number

    let upLeft = pos + CONSTANTS.upLeft;
    let upRight = pos + CONSTANTS.upRight;
    if (upLeft === kingPosition) return false;
    if (upRight === kingPosition) return false;

    return allowed;
  }

  isAllowedByOpponentWhitePawn(piece, kingPosition) {
    const allowed = true;

    let pos = 1 * piece.currentSquare;

    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;
    if (downLeft === kingPosition) return false;
    if (downRight === kingPosition) return false;

    return allowed;
  }

  getCandidateBishopMoves(piece, squares) {
    let candidateMoves = [];
    candidateMoves = this.getCandidateDiagonalMovesUpRight(
      piece,
      squares,
      candidateMoves
    );
    candidateMoves = this.getCandidateDiagonalMovesUpLeft(
      piece,
      squares,
      candidateMoves
    );
    candidateMoves = this.getCandidateDiagonalMovesDownLeft(
      piece,
      squares,
      candidateMoves
    );
    candidateMoves = this.getCandidateDiagonalMovesDownRight(
      piece,
      squares,
      candidateMoves
    );
    return candidateMoves;
  }

  getCandidateDiagonalMovesUpRight(piece, squares, candidateMoves) {
    const DLM = CONSTANTS.defaultDelim;
    let pos = 1 * piece.currentSquare;

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

      if (squares[dst].piece === null) {
        candidateMoves.push(pos + DLM + dst);
      } else if (squares[dst].piece.white !== piece.white) {
        candidateMoves.push(pos + DLM + dst); // eat opponent's piece
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
    let pos = 1 * piece.currentSquare;

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
    let pos = 1 * piece.currentSquare;

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
    let pos = 1 * piece.currentSquare;

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
    //console.log('down left moves ='+candidateMoves.length);
    return candidateMoves;
  }

  getCandidateRookMoves(piece, squares) {
    //console.log('<ROOK> moves </ROOK>');
    const DLM = CONSTANTS.defaultDelim;
    let pos = 1 * piece.currentSquare;

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
    const pos = 1 * piece.currentSquare;
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
    let pos = 1 * piece.currentSquare; // ensure this is dealt as an integer!

    let up = pos + CONSTANTS.up;
    let down = pos + CONSTANTS.down;
    let left = pos + CONSTANTS.left;
    let right = pos + CONSTANTS.right;
    let downLeft = pos + CONSTANTS.downLeft;
    let downRight = pos + CONSTANTS.downRight;
    let upLeft = pos + CONSTANTS.upLeft;
    let upRight = pos + CONSTANTS.upRight;

    //console.log('isallowedby king, piece =  ' + piece.type + ' king pos = ' + kingPosition);

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
      canditDst = 1 * move[1];
      canditSrc = 1 * move[0]; // ensure that it's an integer! (*1)
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

    let pos = 1 * piece.currentSquare;

    let UP = pos + CONSTANTS.up;
    let DOWN = pos + CONSTANTS.down;
    let LEFT = pos + CONSTANTS.left;
    let RIGHT = pos + CONSTANTS.right;

    let canditSrc = 0;
    let canditDst = 0;

    if (opponentCandidateMove !== undefined) {
      const move = opponentCandidateMove.split(DLM); // [1] === dst move
      canditSrc = 1 * move[0];
      canditDst = 1 * move[1];
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
    //console.log('rook moves DOWN = ' + candidateMoves.length);

    // move RIGHT
    let movesRight = CONSTANTS.maxCol - squares[pos].col;

    for (let i = RIGHT; i <= movesRight + pos; i++) {
      //console.log('checking rook_right, i = ' + i + ' candit move='+opponentCandidateMove);

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
    //console.log('rook moves RIGHT = ' + candidateMoves.length);

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
    let pos = 1 * piece.currentSquare;
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
    let pos = 1 * piece.currentSquare;
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
    let pos = 1 * piece.currentSquare;
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
        //console.log('Move accepted, collides with candit dst, OK.');
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
    let pos = 1 * piece.currentSquare;
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
        //console.log('Move accepted, collides with candit dst, OK.');
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
          console.log("Eat black candidate move = " + move);
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
          console.log("Eat white candidate move = " + move);
          return allowedMovesBlack[i];
        }
      }
    }
    const n = Math.floor(Math.random() * allowedMovesBlack.length);
    return allowedMovesBlack[n];
  }
}
export default Moves;
