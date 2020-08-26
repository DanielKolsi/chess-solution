import React from "react";
import Square from "./Square";
import NextTurn from "./NextTurn";
import PrevMove from "./PrevMove";

import CONSTANTS from "../config/constants";
import Moves from "./Moves";
import _ from "lodash";

/**
 * TODO: add heuristics: isPieceDefended, isPieceThreatening, isPieceCapturingValuable...isPieceDeliveringCheck..., pawnMovesTwo
 * promotion, castling...enPassant..
 */
class Chess extends Moves {
  constructor(props) {
    super(props);
    this.state = {
      currentBoardSquares: [], // current board squares; all next turn possibilities will create a separate (candidate) board
      candidateBoards: [], // each board has different squares, there are as many boards as there are allowed move possibilities per a turn
      pieces: {},
      staleMateQueenWarning: false,

      // promotions
      promotedWhiteQueenNumber: CONSTANTS.maxWhite + 1,
      promotedBlackQueenNumber: -1,

      // underpromotions
      promotedWhiteRookNumber: 70,
      promotedBlackRookNumber: -10,
      promotedWhiteBishopNumber: 80,
      promotedBlackBishopNumber: -20,
      promotedWhiteKnightNumber: 90,
      promotedBlacKnightNumber: -30,

      white: true,
      previousBoards: [], // array (stack with push/pop) of previous boards
      nextTurn: 1,

      previousMove: null, // TODO: possible needed for checking allowance for en passat

      whiteKingMoved: false, // castling initial condition: rooks and king shall not be moved
      whiteLeftRookMoved: false,
      whiteRightRookMoved: false,
      blackKingMoved: false,
      blackLeftRookMoved: false,
      blackRightRookMoved: false,
      // castling initial condition: rooks and king shall not be moved
      gameOver: false,
    };

    this.moveMap = this.moveMap.bind(this);
    this.nextTurn = this.nextTurn.bind(this);
    this.prevMove = this.prevMove.bind(this);
  }

  componentWillMount() {
    this.initBoard();
  }

  componentDidMount() {
    this.initPieces();
  }

  moveMap(sr, sc, dr, dc) {
    const src = 56 - (sr - 1) * 8 + (sc - 1);
    const dst = 56 - (dr - 1) * 8 + (dc - 1);
    this.doMove(src, dst);
  }

  getCandidateMovesForWhitePiece(piece, board) {
    let candidateMoves = [];

    switch (piece.value) {
      case 1:
        candidateMoves = this.getCandidateWhitePawnMoves(
          piece,
          board,
          this.state.previousMove
        );
        break;

      case 3:
        candidateMoves = this.getCandidateKnightMoves(piece, board);
        break;
      case 4:
        candidateMoves = this.getCandidateBishopMoves(piece, board);
        break;
      case 5:
        candidateMoves = this.getCandidateRookMoves(piece, board);
        break;
      case 6:
        candidateMoves = this.getCandidateWhiteKingMoves(piece, board);
        break;

      case 9:
        candidateMoves = this.getCandidateQueenMoves(piece, board);
        break;
      default:
    }
    return candidateMoves;
  }

  getCandidateMovesForBlackPiece(piece, board) {
    let candidateMoves = [];

    switch (piece.value) {
      case -1:
        candidateMoves = this.getCandidateBlackPawnMoves(
          piece,
          board,
          this.state.previousMove
        );
        break;
      case -3:
        candidateMoves = this.getCandidateKnightMoves(piece, board);
        break;
      case -4:
        candidateMoves = this.getCandidateBishopMoves(piece, board);
        break;
      case -5:
        candidateMoves = this.getCandidateRookMoves(piece, board);
        break;
      case -6:
        candidateMoves = this.getCandidateBlacKingMoves(piece, board);
        break;
      case -9:
        candidateMoves = this.getCandidateQueenMoves(piece, board);
        break;
      default:
    }
    return candidateMoves;
  }

  getDelim(move) {
    const CHR = move.charAt(2);
    return isNaN(CHR) ? CHR : move.charAt(1);
  }

  getMovesString(move) {
    const DELIMITER = this.getDelim(move);
    return move.split(DELIMITER);
  }

  getCandidateBoardCorrespondingAllowedMove(allowedMove, board, white) {
    const delim = this.getDelim(allowedMove);
    let moves = this.getMovesString(allowedMove); // src = moves[0], dst = moves[1]

    // handle promotions and underpromotions
    if (delim === CONSTANTS.promotionToQueen) {
      let promotedQueenNumber = white
        ? this.state.promotedWhiteQueenNumber
        : this.state.promotedBlackQueenNumber;

      board = this.doPromote(board, moves, promotedQueenNumber);
    } else if (delim === CONSTANTS.promotionToRook) {
      let promotedRookNumber = white
        ? this.state.promotedWhiteRookNumber
        : this.state.promotedBlackRookNumber;

      board = this.doPromote(board, moves, promotedRookNumber);
    } else if (delim === CONSTANTS.promotionToBishop) {
      let promotedBishopNumber = white
        ? this.state.promotedWhiteBishopNumber
        : this.state.promotedBlackBishopNumber;

      board = this.doPromote(board, moves, promotedBishopNumber);
    } else if (delim === CONSTANTS.promotionToKnight) {
      let promotedKnightNumber = white
        ? this.state.promotedWhiteKnightNumber
        : this.state.promotedBlackKnightNumber;

      board = this.doPromote(board, moves, promotedKnightNumber);
    } else if (delim === CONSTANTS.castlingQueenSide) {
      board = this.castleQueenSideAllowedBoard(white, board); // castle queen side was the allowed move, create the corresponding board
    } else if (delim === CONSTANTS.castlingKingSide) {
      board = this.castleKingSideAllowedBoard(white, board);
    } else if (delim === CONSTANTS.enPassant) {
      board = this.doEnPassantComplete(board, moves);
    } else {
      // normal move, includes eats

      board[moves[1]].piece = board[moves[0]].piece; // the move: dst square's piece becomes src square's piece
      board[moves[1]].piece.currentSquare = parseInt(moves[1], 10);
      board[moves[0]].piece = null; // the original src piece has moved, so the square doesn't have its peace anymore
    }
    return board;
  }

  doPromote(board, moves, promotedPieceNumber) {
    let { pieces } = this.state;

    board[moves[1]].piece = pieces[promotedPieceNumber];
    board[moves[1]].piece.currentSquare = parseInt(moves[1], 10);
    board[moves[0]].piece = null;

    return board;
  }

  /*
  doBasicMove(srcSquare, dstSquare) {
    dstSquare.piece = srcSquare.piece; // this handles a capture as well!
    srcSquare.piece = null;
  }*/

  doEnPassantComplete(board, moves) {
    let pieceToBeRemovedSquare = null;

    const srcSquare = parseInt(moves[0], 10);
    const dstSquare = parseInt(moves[1], 10);

    if (dstSquare === srcSquare + CONSTANTS.downLeft) {
      pieceToBeRemovedSquare = srcSquare + CONSTANTS.left;
    } else if (dstSquare === srcSquare + CONSTANTS.downRight) {
      pieceToBeRemovedSquare = srcSquare + CONSTANTS.right;
    } else if (dstSquare === srcSquare + CONSTANTS.upLeft) {
      pieceToBeRemovedSquare = srcSquare + CONSTANTS.left;
    } else if (dstSquare === srcSquare + 9) {
      pieceToBeRemovedSquare = srcSquare + CONSTANTS.right;
    }

    board[dstSquare].piece = board[srcSquare].piece;
    board[srcSquare].piece = null;
    console.log("removed piece = " + pieceToBeRemovedSquare);
    board[pieceToBeRemovedSquare].piece = null;
    return board;
  }

  castleQueenSideAllowedBoard(white, board) {
    if (white) {
      console.log("WHITE queen side castling allowed...");
      return this.castleQueenSideWhite(board);
    } else {
      return this.castleQueenSideBlack(board);
    }
  }
  castleKingSideAllowedBoard(white, board) {
    if (white) {
      return this.castleKingSideWhite(board);
    } else {
      return this.castleKingSideBlack(board);
    }
  }
  castleQueenSideBlack(board) {
    if (board[4].piece && board[0].piece) {
      // this condition is enough at this point!
      board[2].piece = board[4].piece;
      board[4].piece = null;
      board[3].piece = board[0].piece;
      board[0].piece = null;
    } else {
      console.error(
        "ERROR: KingB or RookBA has moved alread, castling not allowed!"
      );
    }
    return board;
  }
  castleKingSideBlack(board) {
    if (board[4].piece && board[7].piece) {
      board[6].piece = board[4].piece;
      board[4].piece = null;
      board[5].piece = board[7].piece;
      board[7].piece = null;
    } else {
      console.error(
        "ERROR: KingB or RookBH has moved alread, castling not allowed!"
      );
    }
    return board;
  }

  castleQueenSideWhite(board) {
    if (board[60].piece && board[56].piece) {
      // this condition is sufficient!

      board[58].piece = board[60].piece;
      board[60].piece = null;
      board[59].piece = board[56].piece;
      board[56].piece = null;
    } else {
      console.error(
        "ERROR: KingW or RookWA has moved alread, castling not allowed!"
      );
    }
    return board;
  }
  castleKingSideWhite(board) {
    if (board[60].piece && board[63].piece) {
      // this condition is sufficient!
      board[62].piece = board[60].piece;
      board[60].piece = null;
      board[61].piece = board[63].piece;
      board[63].piece = null;
    } else {
      console.error(
        "ERROR: KingW or RookWH has moved alread, castling not allowed!"
      );
    }
    return board;
  }

  // board needs to be constructed before pieces are added
  initBoard() {
    const squares = [65]; // the last square is just for falling a possible CHECK for this candidate board position!

    // fill board with squares
    for (let idx = 0, i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let square = {
          index: idx,
          row: i, // rows: 0...7
          col: j, // col: 0...7
          piece: null,
        }; // each square has an index ranging from 0 to 63
        squares[idx] = square;
        idx++;
      }
    }
    this.setState({ currentBoardSquares: squares });
  }

  // pieces will be added to the board after the board has been constructed
  initPieces() {
    const { currentBoardSquares, pieces } = this.state;

    this.props.chess.forEach((item) => {
      let piece = {
        currentSquare: item[0], // number 0..63, changes
        type: item[1], // actual piece, e.g. RookBA
        id: item[2], // piece id, e.g. bra
        n: item[3], // ORIGINAL number 0..63, won't change (unique identifier)
        white: item[4], // true if white
        value: item[5], // piece value ( black has negative corresponding values), won't change, because piece is replaced in promotion!
        //value: //exact piece value in relation to other pieces
      };

      if (item[0] >= 0 && item[0] <= CONSTANTS.maxWhite) {
        currentBoardSquares[item[0]].piece = piece;
      }
      pieces[piece.n] = piece;
    });

    this.setState({ pieces });
    //this.makeNumberOfMoves(3); // check game over condition!
  }

  makeNumberOfMoves(n) {
    if (!this.gameOver) {
      for (let i = 0; i < n; i++) {
        this.nextTurn(i + 1);
      }
    }
  }

  prevMove() {
    console.log("prevmove..");
    this.setState({
      currentBoardSquares: this.state.previousBoards.pop(),
      white: !this.state.white,
    });
  }

  getCandidateMoves(white, board) {
    let candidateMoves = [];
    if (white) {
      candidateMoves = this.getCandidateMovesWhite(board);
    } else {
      candidateMoves = this.getCandidateMovesBlack(board);
    }
    console.log("candit moves = " + candidateMoves);
    return candidateMoves;
  }
  getAllowedMoves(white, board, candidateMoves) {
    if (candidateMoves === null || candidateMoves.length === 0) return null;

    let allowedMoves = [];
    if (white) {
      allowedMoves = this.getAllowedMovesWhite(board, candidateMoves);
    } else {
      allowedMoves = this.getAllowedMovesBlack(board, candidateMoves);
    }
    return allowedMoves;
  }

  // Principle: pieces are always taken from squares (board)
  getCandidateMovesWhite(board) {
    let candidateMovesWhite = [];
    let castlingLeftAdded = false;
    let castlingRightAdded = false;

    for (let i = 0; i <= CONSTANTS.maxWhite; i++) {
      let piece = board[i].piece;

      if (piece === null || piece === undefined) {
        continue; // piece has been e.g. eaten
      }
      if (piece.white === false) continue; // it was a black piece...

      let candidateMoves = this.getCandidateMovesForWhitePiece(piece, board);

      if (candidateMoves === undefined) {
        console.log("No available moves for this piece.");
        continue;
      }

      if (
        board[CONSTANTS.whiteKingId].piece !== null &&
        this.state.whiteKingMoved === false // it's OK to have only one variable in state for 'whiteKingMoved', as it corresponds the real history i.e. squares (the chosen previous move)
      ) {
        if (
          !castlingLeftAdded &&
          !this.state.whiteLeftRookMoved &&
          board[56].piece !== null
        ) {
          if (
            board[57].piece === null &&
            board[58].piece === null &&
            board[59].piece === null &&
            board[56].piece.value === 5
          ) {
            candidateMoves.push(
              CONSTANTS.whiteKingId + CONSTANTS.castlingQueenSide + 58
            ); //add white castling (white king move!) left as a candidate move
            castlingLeftAdded = true;
          }
        }
        if (!castlingRightAdded && !this.state.whiteRightRookMoved) {
          if (
            board[61].piece === null &&
            board[62].piece === null &&
            board[63].piece !== null
          ) {
            candidateMoves.push(
              CONSTANTS.whiteKingId + CONSTANTS.castlingKingSide + 62
            ); //add white castling right (king move!) as a candidate move
            castlingRightAdded = true;
          }
        }
      }

      if (
        candidateMoves.length > 0 &&
        candidateMovesWhite.length === undefined
      ) {
        candidateMovesWhite = candidateMoves;
      } else if (candidateMoves.length > 0) {
        if (!candidateMovesWhite.includes(candidateMoves)) {
          candidateMovesWhite = candidateMovesWhite.concat(candidateMoves); // candidateMoves, removalmoves, candidateMoves
          /*console.log(
          "concatenating moves, added n = " +
            candidateMoves.length +
            " total = " +
            candidateMovesWhite.length
        );*/
        }
      }
    }

    return candidateMovesWhite;
  }

  /*
    This function is both for checking candidate moves for white / black AND for
    using as a "rejector" for the candidate move when opponentKing and opponentCandidateMove are specified.
  */
  getCandidateMovesBlack(board) {
    let candidateCastlingMovesForBlack = [];
    let castlingLeftAdded = false;
    let castlingRightAdded = false;

    for (let i = 0; i <= 63; i++) {
      let piece = board[i].piece;

      if (piece === null || piece === undefined) {
        continue; // piece has been e.g. eaten
      }
      if (piece.white === true) continue; // it was white!

      const candidateMoves = this.getCandidateMovesForBlackPiece(piece, board);

      if (candidateMoves === undefined) {
        continue; // no available moves for this piece
      }

      if (
        board[CONSTANTS.blackKingId].piece !== null &&
        this.state.blackKingMoved === false
      ) {
        if (
          !castlingLeftAdded &&
          !this.state.blackLeftRookMoved &&
          board[0].piece !== null
        ) {
          if (
            board[1].piece === null &&
            board[2].piece === null &&
            board[3].piece === null
          ) {
            candidateMoves.push(
              CONSTANTS.blackKingId + CONSTANTS.castlingQueenSide + 2
            ); //add black castling (king move!) left as a candidate move
            castlingLeftAdded = true;
          }
        }
        if (
          !castlingRightAdded &&
          !this.state.blackRightRookMoved &&
          board[7].piece !== null
        ) {
          if (board[5].piece === null && board[6].piece === null) {
            candidateMoves.push(
              CONSTANTS.blackKingId + CONSTANTS.castlingKingSide + 6
            ); //add black castling right (king move!) as a candidate move
            castlingRightAdded = true;
          }
        }
      }

      if (
        candidateMoves.length > 0 &&
        candidateCastlingMovesForBlack.length === undefined
      ) {
        candidateCastlingMovesForBlack = candidateMoves;
      } else if (candidateMoves.length > 0) {
        if (!candidateCastlingMovesForBlack.includes(candidateMoves)) {
          candidateCastlingMovesForBlack = candidateCastlingMovesForBlack.concat(
            candidateMoves
          ); // candidateMoves, removalmoves, candidateMoves
        }
      }
    }
    return candidateCastlingMovesForBlack;
  }

  getMovePointsWhiteTrivial(allowedMoveWhite) {
    const move = allowedMoveWhite.split(CONSTANTS.defaultDelim);
    const src = move[0];
    const dst = move[1];

    let points = src - dst;

    if (points < 0) {
      points = Math.abs(dst - src) - 20;
    }
    if (points === undefined) {
      points = 100; // castling
    }
  }

  // get move points for this board position
  // TODO: this function should be modified to have the heuristics to get the best possible (white) move
  getNumberOfAllowedMovesFromThisBoardPosition(board, white, boardIdx) {
    let candidateMoves = [];
    let allowedMoves = [];
    if (white) {
      candidateMoves = this.getCandidateMovesWhite(board); // TODO, add *CHECK* instaed of eating the king!
      allowedMoves = this.getAllowedMovesWhite(board, candidateMoves, boardIdx);
    } else {
      candidateMoves = this.getCandidateMovesBlack(board);
      allowedMoves = this.getAllowedMovesBlack(board, candidateMoves, boardIdx);
    }

    return allowedMoves.length;
  }

  /**
   * From the possible moves return those moves which are actually allowed.
   * @param  {[type]} candidateMovesWhite [description]
   * @param  {[type]} kingPosition       [description]
   * @param  {[type]} board            [description]
   * @return {[type]}                    allowedMoves
   */
  getAllowedMovesWhite(board, candidateMovesWhite, boardIdx) {
    const { candidateBoards, pieces } = this.state;
    let allowedMoves = []; // contains only the candidate moves that were eventually verified to be allowed
    let whiteKingPosition = pieces[60].currentSquare;

    for (let i = 0; i < candidateMovesWhite.length; i++) {
      const whiteCandidateMove = candidateMovesWhite[i];
      let moves = this.getMovesString(candidateMovesWhite[i]);
      const delim = this.getDelim(candidateMovesWhite[i]);

      if (delim === CONSTANTS.check) {
        moves = candidateMovesWhite[i].split(CONSTANTS.check);
        board[64] = CONSTANTS.CHECK;
        candidateBoards[boardIdx] = board;

        this.setState({ candidateBoards });
        console.error(
          "CHECK revised as an possible allowed move, candit move = " +
            whiteCandidateMove
        );
      } else if (delim === CONSTANTS.castlingQueenSide) {
        console.log("Checking allowance of white queen side castling...");
        let blackCandidateMoves = this.getCandidateMovesBlack(board);

        let allowLeftCastling = true;
        const re = /.60|.59|.58|.57/g; // numbers of the not-allowed squares

        for (let i = 0; i < blackCandidateMoves.length; i++) {
          const canditMove = blackCandidateMoves[i];
          //console.log('castling check: black move match: ' + canditMove + ' re = ' + re);
          let match = canditMove.match(re);

          if (match !== null) {
            console.log(
              "castling check: white left castling NOT allowed, candit =" +
                whiteCandidateMove +
                " match=" +
                match +
                " black matching move = " +
                canditMove
            );
            allowLeftCastling = false;
            break;
          }
        }
        if (allowLeftCastling) {
          allowedMoves.push(whiteCandidateMove);
          // console.log("castling check: left castling allowed, str =" + str);
        }
        continue; // no further allowance checks required!
      } else if (delim === CONSTANTS.castlingKingSide) {
        let blackCandidateMoves = this.getCandidateMovesBlack(board);
        let allowKingSideCastling = true;
        const re = /.60|.61|.62/g; // numbers of the not-allowed squares

        for (let i = 0; i < blackCandidateMoves.length; i++) {
          const canditMove = blackCandidateMoves[i];
          if (canditMove.match(re) !== null) {
            allowKingSideCastling = false;
            console.log(
              "castling check: right castling NOT allowed, candit =" +
                whiteCandidateMove
            );
            break;
          }
        }
        if (allowKingSideCastling) {
          allowedMoves.push(whiteCandidateMove);
        }
        continue;
      }

      if (moves[0] === whiteKingPosition) {
        // white king move candidate!
        whiteKingPosition = moves[1];
      }

      if (
        this.isWhiteMoveAllowed(board, whiteKingPosition, whiteCandidateMove)
      ) {
        allowedMoves.push(whiteCandidateMove);
      }
    } // ..for

    return allowedMoves;
  }

  getAllowedMovesBlack(board, candidateMovesBlack) {
    let allowedMoves = []; // contains only the candidate moves that were eventually verified to be allowed

    const DLM = CONSTANTS.defaultDelim;
    const blackKingPosition = this.state.pieces[4].currentSquare;

    for (let i = 0; i < candidateMovesBlack.length; i++) {
      const str = candidateMovesBlack[i];

      let moves = this.getMovesString(str);

      if (str.includes(CONSTANTS.castlingQueenSide)) {
        let whiteCandidateMoves = this.getCandidateMovesWhite(board);
        let allowLeftCastling = true;
        const re = /1|2|3|4/g; // numbers of the not-allowed squares

        for (let i = 0; i < whiteCandidateMoves.length; i++) {
          const canditMove = whiteCandidateMoves[i].split(DLM);
          const dst = canditMove[1];
          if (dst === undefined) continue; // P , ()
          if (dst.length !== 1) continue;
          let match = dst.match(re);

          if (match !== null) {
            allowLeftCastling = false;
            break;
          }
        }
        if (allowLeftCastling) {
          allowedMoves.push(str);
        }
        continue;
      } else if (str.includes(CONSTANTS.castlingKingSide)) {
        let whiteCandidateMoves = this.getCandidateMovesWhite(board);
        let allowRightCastling = true;
        const re = /4|5|6/g; // numbers of the not-allowed squares

        for (let i = 0; i < whiteCandidateMoves.length; i++) {
          const canditMove = whiteCandidateMoves[i].split(DLM);
          const dst = canditMove[1];
          if (dst === undefined) continue; // P or ()
          if (dst.length !== 1) continue;
          let match = dst.match(re);

          if (match !== null) {
            allowRightCastling = false;
            break;
          }
        }
        if (allowRightCastling) {
          allowedMoves.push(str);
        }
        continue;
      }

      let src = parseInt(moves[0], 10);
      const dst = parseInt(moves[1], 10);
      let kingPosition = blackKingPosition;

      if (src === kingPosition) {
        // black king move candidate!
        kingPosition = dst;
      }

      if (this.isBlackMoveAllowed(board, kingPosition, str)) {
        allowedMoves.push(str);
      }
    }
    return allowedMoves;
  }

  // to check whether a white move is allowed, you need to check opponent's next possible moves
  // if any black move collides with the white king, the white candidate move is rejected immediately
  isWhiteMoveAllowed(board, whiteKingPosition, whiteCandidateMove) {
    let allowed = true;

    for (let i = 0; i <= 63; i++) {
      let piece = board[i].piece;

      if (piece === null || piece === undefined) {
        continue; // piece has been e.g. eaten
      }

      const value = piece.value;

      switch (value) {
        case CONSTANTS.BLACK_PAWN_CODE:
          allowed = this.isAllowedByOpponentBlackPawn(piece, whiteKingPosition);
          break;
        case CONSTANTS.BLACK_KNIGHT_CODE:
          allowed = this.isAllowedByOpponentKnight(piece, whiteKingPosition);
          break;
        case CONSTANTS.BLACK_BISHOP_CODE:
          allowed = this.isAllowedByOpponentBishop(
            piece,
            board,
            whiteKingPosition,
            whiteCandidateMove
          );
          break;
        case CONSTANTS.BLACK_ROOK_CODE:
          allowed = this.isAllowedByOpponentRook(
            piece,
            board,
            whiteKingPosition,
            whiteCandidateMove
          );
          break;
        case CONSTANTS.BLACK_KING_CODE:
          allowed = this.isAllowedByOpponentKing(piece, whiteKingPosition);
          break;
        case CONSTANTS.BLACK_QUEEN_CODE:
          allowed = this.isAllowedByOpponentQueen(
            piece,
            board,
            whiteKingPosition,
            whiteCandidateMove
          );
          break;
        default:
          break;
      }
      if (!allowed) return false;
    }
    return allowed;
  }

  // to check whether a black move is allowed, you need to check opponent's next possible moves
  // if any black move collides with the white king, the white candidate move is rejected immediately
  isBlackMoveAllowed(board, blackKingPosition, blackCandidateMove) {
    let allowed = true;

    for (let i = 0; i <= 63; i++) {
      let piece = board[i].piece;

      if (piece === null || piece === undefined) {
        continue; // piece has been e.g. eaten
      }

      switch (piece.value) {
        case 1:
          allowed = this.isAllowedByOpponentWhitePawn(piece, blackKingPosition);
          break;
        case 3:
          allowed = this.isAllowedByOpponentKnight(piece, blackKingPosition);
          break;
        case 4:
          allowed = this.isAllowedByOpponentBishop(
            piece,
            board,
            blackKingPosition,
            blackCandidateMove
          );
          break;
        case 5:
          allowed = this.isAllowedByOpponentRook(
            piece,
            board,
            blackKingPosition,
            blackCandidateMove
          );
          break;
        case 6:
          allowed = this.isAllowedByOpponentKing(piece, blackKingPosition);
          break;
        case 9:
          allowed = this.isAllowedByOpponentQueen(
            piece,
            board,
            blackKingPosition,
            blackCandidateMove
          );
          break;
        default:
          break;
      }
      if (!allowed) return false; // have to return immediately if the move wasn't allowed! (no need to continue checking against other pieces)
    } // ..for
    return allowed;
  }

  nextTurn(nextTurn) {
    this.setState({ nextTurn: nextTurn });

    let {
      currentBoardSquares: squares,
      white,
      candidateBoards,
      pieces,
    } = this.state;
    const previousBoard = _.cloneDeep(squares);
    this.state.previousBoards.push(previousBoard); // stack of previous boards, Lodash deep clone is required!

    const candidateMoves = this.getCandidateMoves(white, squares);

    //console.log("candidate white moves =" + candidateMovesWhite);
    const allowedMoves = this.getAllowedMoves(white, squares, candidateMoves);

    if (allowedMoves === null || allowedMoves.length === 0) {
      if (white) {
        console.log("Game over, black wins. ");
      } else {
        console.log("Game over, white wins. ");
      }
      document.getElementById("next").disabled = true;
      return;
    }

    console.log(
      " WHITE = " + white + " allowed moves:" + allowedMoves.join("|")
    );
    let numberOfPossibleNextMoves = [];
    let maxIdx = 0;
    let max = 0;

    for (let i = 0; i < allowedMoves.length; ++i) {
      // board will be stored to boards array (state)
      //Lodash deep clone is required, as the array contains objects (i.e. pieces)
      //https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089

      // each allowed move corresponds one candidateBoard, that is, their indexes are synchronized
      candidateBoards[i] = this.getCandidateBoardCorrespondingAllowedMove(
        allowedMoves[i],
        _.cloneDeep(squares),
        white
      ); //TODO, check that all kind of special moves are dealt as well (e.g. castling and its restrictiones)

      numberOfPossibleNextMoves[
        i
      ] = this.getNumberOfAllowedMovesFromThisBoardPosition(
        candidateBoards[i],
        white,
        i
      );

      console.log(
        "White previous move:" +
          allowedMoves[i] +
          " | Points = " +
          numberOfPossibleNextMoves[i] +
          " | board number = " +
          i
      );
    } // ..for

    maxIdx = this.getMaxMovesIndexWhileAvoidingStalemate(
      white,
      candidateBoards,
      allowedMoves,
      numberOfPossibleNextMoves
    );

    let selectedMove;
    if (!white) {
      // for black, instead of using the "optimal" move select a random move!
      selectedMove = this.getBestBlackMove(squares, allowedMoves); // numberOfPossibleNextMoves[Math.floor(Math.random() * numberOfPossibleNextMoves.length)];
      maxIdx = allowedMoves.indexOf(selectedMove); // this will actually be a random move index
      console.log(
        "selected move for black = " +
          selectedMove +
          " possible moves length = " +
          numberOfPossibleNextMoves.length +
          " maxIdx = " +
          maxIdx
      );
    } else {
      selectedMove = allowedMoves[maxIdx];
      max = numberOfPossibleNextMoves[maxIdx];
    }

    console.log("boards = " + candidateBoards.length);

    console.log(
      "max = " +
        max +
        " max_idx = " +
        maxIdx +
        " real max value = " +
        allowedMoves[maxIdx]
    );

    const moves = this.getMovesString(selectedMove); // TODO: how about castling and en passe?

    console.log("moveStr = " + moves);
    const pieceNumberId = candidateBoards[maxIdx][moves[1]].piece.n;

    if (pieceNumberId === 60 || pieceNumberId === 4) {
      // king moved
      pieces[pieceNumberId].currentSquare = parseInt(moves[1], 10);
    } else if (white && pieceNumberId > 63 && pieceNumberId < 70) {
      // white promoted queen = [63, 69]
      console.error("UPDATE next promoted WHITE queen number!!");
      this.setState({
        promotedWhiteQueenNumber: ++this.state.promotedWhiteQueenNumber,
      });
    } else if (!white && pieceNumberId < 0 && pieceNumberId > -8) {
      this.setState({
        promotedBlackQueenNumber: --this.state.promotedBlackQueenNumber,
      });
    } // TODO: add underpromotion piece number counters! (white & black)

    this.handleCastlingAllowedCondition(squares[moves[0]]); // we need to check if the selected move caused restrictions that block future castling

    this.setState(
      {
        pieces,
        candidateBoards,
        currentBoardSquares: candidateBoards[maxIdx],
        white: !white,
      },
      function () {
        //console.log("setState completed", this.state);
      }
    );
  }

  getMaxMovesIndexWhileAvoidingStalemate(
    isWhiteTurn,
    candidateBoards,
    allowedMoves,
    numberOfPossibleNextMoves
  ) {
    let max = 0;
    let maxIdx = 0;

    for (let i = 0; i < candidateBoards.length; ++i) {
      if (numberOfPossibleNextMoves[i] > max) {
        max = numberOfPossibleNextMoves[i]; // select the move from the allowed moves which got the highest points
        maxIdx = i;
      } else if (candidateBoards[i][64] === CONSTANTS.CHECK) {
        if (
          this.getNumberOfAllowedOpponentMoves(
            isWhiteTurn,
            i,
            candidateBoards
          ) === 0
        ) {
          return i; // this will be maxIdx, becaue it's an immediate mate!
        }
      }
    }
    console.log("INITIALLY SELECTED max = " + max + " idx = " + maxIdx);

    if (
      this.getNumberOfAllowedOpponentMoves(
        isWhiteTurn,
        maxIdx,
        candidateBoards
      ) === 0
    ) {
      // opponent can't move -> stalemate!

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
        isWhiteTurn,
        candidateBoards,
        allowedMoves,
        numberOfPossibleNextMoves
      ); // recursion is OK here
    } else {
      console.log(
        "MAX accepted, max = " +
          max +
          " idx = " +
          maxIdx +
          " move = " +
          allowedMoves[maxIdx]
      );
    }
    console.log(
      "returning: max = " +
        max +
        " max_idx=" +
        maxIdx +
        " numberOfPossibleNextMoves = " +
        numberOfPossibleNextMoves +
        " allowedMoves[maxIdx] = " +
        allowedMoves[maxIdx]
    );
    return maxIdx;
  }

  getNumberOfAllowedOpponentMoves(white, index, candidateBoards) {
    let allowedOpponentMoves = [];
    let candidateOpponentMoves = [];
    if (white) {
      candidateOpponentMoves = this.getCandidateMovesBlack(
        candidateBoards[index]
      );
      console.log("candit opponent moves = " + candidateOpponentMoves.length);
      allowedOpponentMoves = this.getAllowedMovesBlack(
        candidateBoards[index],
        candidateOpponentMoves
      );
    } else {
      candidateOpponentMoves = this.getCandidateMovesWhite(
        candidateBoards[index]
      );
      allowedOpponentMoves = this.getAllowedMovesWhite(
        candidateBoards[index],
        candidateOpponentMoves
      );
    }
    return allowedOpponentMoves.length;
  }

  handleCastlingAllowedCondition(srcSquare) {
    switch (srcSquare) {
      case CONSTANTS.whiteKingId:
        this.setState({ whiteKingMoved: true });
        break;
      case CONSTANTS.blackKingId:
        this.setState({ blackKingMoved: true });
        break;
      case CONSTANTS.whiteLeftRookId:
        this.setState({ whiteLeftRookMoved: true });
        break;
      case CONSTANTS.whiteRightRookId:
        this.setState({ whiteRightRookMoved: true });
        break;
      case CONSTANTS.blackLeftRookId:
        this.setState({ blackLeftRookMoved: true });
        break;
      case CONSTANTS.blackRightRookId:
        this.setState({ blackRightRookMoved: true });
        break;
      default:
        break;
    }
  }
  render() {
    let board = this.state.currentBoardSquares.map((square, index) => {
      return (
        <Square
          ref={index}
          key={index}
          index={index}
          chessId={square.chessId}
          piece={square.piece}
          moveMap={this.moveMap}
        />
      );
    });

    let rows = [];
    let rowLength = CONSTANTS.squaresInRow;

    for (let i = 0; i < CONSTANTS.maxWhite; i += rowLength) {
      rows.push(board.slice(i, i + rowLength));
    }

    return (
      <div className="wrapper">
        <h3>Chess Solution</h3>
        <div className="nextmove">
          <NextTurn nextTurn={this.nextTurn} />
        </div>
        <div className="prevmove">
          <PrevMove prevMove={this.prevMove} />
        </div>
        <div>
          {" "}
          ================================================================================================{" "}
        </div>

        <div className="chess">
          {rows.map((row, index) => {
            //console.log('row='+row+'index='+index);
            return (
              <div className="row" key={index}>
                {row}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
export default Chess;
