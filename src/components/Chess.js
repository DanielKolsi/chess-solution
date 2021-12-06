import React from "react";
import Square from "./Square";
import NextTurn from "./NextTurn";

import PrevTurn from "./PrevTurn";
import CONSTANTS from "../config/constants";

import * as MoveFunctions from "./MoveFunctions";
import * as CheckFunctions from "./CheckFunctions";
import * as HelpFunctions from "./HelpFunctions";

import { doublePawnPointsHandling } from "./Heuristics";
import _ from "lodash";
import { getTotalOpponentThreatScoreAgainstMe } from "./ThreatScores";

/**
 * General chess setup & move allowances. Tempo. Castling, en passant and such special handling.
 */
class Chess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DEBUG: false,
      white: CONSTANTS.WHITE_STARTS, // white starts by default
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

      previousBoards: [], // array (stack with push/pop) of previous boards
      nextTurn: 1, // 'pointer' to the next turn number (initially will be 1)

      previousMove: null, // possible needed for checking allowance for en passat

      whiteKingMoved: false, // castling initial condition: rooks and king shall not be moved
      whiteLeftRookMoved: false,
      whiteRightRookMoved: false,
      blackKingMoved: false,
      blackLeftRookMoved: false,
      blackRightRookMoved: false,
      // castling initial condition: rooks and king shall not be moved
      gameOver: false,
    };

    //this.moveMap = this.moveMap.bind(this);
    this.nextTurn = this.nextTurn.bind(this);
    this.prevTurn = this.prevTurn.bind(this);
  }

  componentWillMount() {
    this.initBoard();
  }

  componentDidMount() {
    this.initPieces();
    document.getElementById("previous").disabled = true;
  }

  /*moveMap(sr, sc, dr, dc) {
    const src = 56 - (sr - 1) * 8 + (sc - 1);
    const dst = 56 - (dr - 1) * 8 + (dc - 1);
    this.doMove(src, dst);
  }*/

  /**
   *
   * @param {*} piece
   * @param {*} board
   * @returns
   */
  getCandidateMovesForPiece(piece, board) {
    let candidateMoves = [];

    if (piece.value === CONSTANTS.BLACK_PAWN_CODE) {
      candidateMoves = MoveFunctions.getCandidateBlackPawnMoves(
        piece,
        board,
        this.state.previousMove
      );
    } else if (piece.value === CONSTANTS.BLACK_KING_CODE) {
      candidateMoves = MoveFunctions.getCandidateKingMoves(piece, board, true);
    } else {
      switch (Math.abs(piece.value)) {
        case CONSTANTS.WHITE_PAWN_CODE:
          candidateMoves = MoveFunctions.getCandidateWhitePawnMoves(
            piece,
            board,
            this.state.previousMove
          );
          break;
        case CONSTANTS.WHITE_KNIGHT_CODE:
          candidateMoves = MoveFunctions.getCandidateKnightMoves(piece, board);
          break;
        case CONSTANTS.WHITE_BISHOP_CODE:
          candidateMoves = MoveFunctions.getAllCandidateBishopMoves(
            piece,
            board
          );
          break;
        case CONSTANTS.WHITE_ROOK_CODE:
          candidateMoves = MoveFunctions.getCandidateRookMoves(piece, board);
          break;
        case CONSTANTS.WHITE_KING_CODE:
          candidateMoves = MoveFunctions.getCandidateKingMoves(
            piece,
            board,
            false
          );
          break;
        case CONSTANTS.WHITE_QUEEN_CODE:
          candidateMoves = MoveFunctions.getCandidateQueenMoves(piece, board);
          break;
        default:
      }
    }
    return candidateMoves;
  }

  /**
   *
   * @param {*} allowedMove
   * @param {*} board
   * @param {*} white
   * @returns
   */
  getCandidateBoardCorrespondingAllowedMove(allowedMove, board, white) {
    const delim = HelpFunctions.getDelim(allowedMove);
    let moves = HelpFunctions.getMovesString(allowedMove); // src = moves[0], dst = moves[1]

    // handle promotions and underpromotions
    if (delim === CONSTANTS.PROMOTION_TO_QUEEN) {
      let promotedQueenNumber = white
        ? this.state.promotedWhiteQueenNumber
        : this.state.promotedBlackQueenNumber;

      board = this.doPromote(board, moves, promotedQueenNumber);
    } else if (delim === CONSTANTS.PROMOTION_TO_ROOK) {
      let promotedRookNumber = white
        ? this.state.promotedWhiteRookNumber
        : this.state.promotedBlackRookNumber;

      board = this.doPromote(board, moves, promotedRookNumber);
    } else if (delim === CONSTANTS.PROMOTION_TO_BISHOP) {
      let promotedBishopNumber = white
        ? this.state.promotedWhiteBishopNumber
        : this.state.promotedBlackBishopNumber;

      board = this.doPromote(board, moves, promotedBishopNumber);
    } else if (delim === CONSTANTS.PROMOTION_TO_KNIGHT) {
      let promotedKnightNumber = white
        ? this.state.promotedWhiteKnightNumber
        : this.state.promotedBlackKnightNumber;

      board = this.doPromote(board, moves, promotedKnightNumber);
    } else if (delim === CONSTANTS.CASTLING_QUEEN_SIDE) {
      board = this.castleQueenSideAllowedBoard(white, board); // castle queen side was the allowed move, create the corresponding board
    } else if (delim === CONSTANTS.CASTLING_KING_SIDE) {
      board = this.castleKingSideAllowedBoard(white, board);
    } else if (delim === CONSTANTS.EN_PASSANT) {
      board = this.doEnPassantComplete(board, moves);
    } else {
      // normal move, includes eats
      board[moves[1]].piece = board[moves[0]].piece; // the move: dst square's piece becomes src square's piece
      board[moves[1]].piece.currentSquare = parseInt(moves[1], 10);
      board[moves[0]].piece = null; // the original src piece has moved, so the square doesn't have its peace anymore
    }
    return board;
  }

  /**
   *
   * @param {*} board
   * @param {*} moves
   * @param {*} promotedPieceNumber
   * @returns
   */
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

  /**
   *
   * @param {*} board
   * @param {*} moves
   * @returns
   */
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

    return pieces;
  }

  /*makeNumberOfMoves(n) {
    if (!this.gameOver) {
      for (let i = 0; i < n; i++) {
        this.nextTurn(i + 1);
      }
    }
  }*/

  /**
   *
   * @param {*} white
   * @param {*} board
   * @returns
   */
  getCandidateMoves(white, board) {
    let candidateMoves = [];
    if (white) {
      candidateMoves = this.getCandidateMovesWhite(board);
    } else {
      candidateMoves = this.getCandidateMovesBlack(board);
    }
    //console.log("candit moves = " + candidateMoves);
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
    allowedMoves = this.getTransformToPlusDelimForCheckMoves(
      board,
      allowedMoves,
      white
    );
    console.log("allowedmoves | " + white + " || " + allowedMoves);
    return allowedMoves;
  }

  /**
   *
   * @param {*} board
   * @param {*} allowedMoves
   * @param {*} white
   */
  getTransformToPlusDelimForCheckMoves(board, allowedMoves, white) {
    for (let i = 0; i < allowedMoves.length; i++) {
      const moves = HelpFunctions.getMovesString(allowedMoves[i]);
      const src = parseInt(moves[0], 10);
      let piece = board[src].piece;

      switch (
        Math.abs(piece.value) // handles both white & black piece values
      ) {
        case CONSTANTS.WHITE_PAWN_CODE:
          allowedMoves[i] = CheckFunctions.getCheckPlusSymbolForPawnMove(
            board,
            allowedMoves[i],
            white
          );
          break;
        case CONSTANTS.WHITE_KNIGHT_CODE:
          allowedMoves[i] = CheckFunctions.getCheckPlusSymbolForKnightMove(
            board,
            allowedMoves[i],
            white
          );
          break;
        case CONSTANTS.WHITE_BISHOP_CODE:
          allowedMoves[i] = CheckFunctions.getCheckPlusSymbolForBishopMove(
            board,
            allowedMoves[i],
            white
          );
          break;
        case CONSTANTS.WHITE_ROOK_CODE:
          allowedMoves[i] = CheckFunctions.getCheckPlusSymbolForRookMove(
            board,
            allowedMoves[i],
            white
          );
          break;
        case CONSTANTS.WHITE_QUEEN_CODE:
          allowedMoves[i] = CheckFunctions.getCheckPlusSymbolForQueenMove(
            board,
            allowedMoves[i],
            white
          );
          break;
        default:
        // console.log("DEFAULT: " + white);
      }
    }
    return allowedMoves;
  }

  // Principle: pieces are always taken from squares (board)
  /**
   *
   * @param {*} board
   * @returns
   */
  getCandidateMovesWhite(board) {
    let candidateMovesWhite = [];
    let castlingLeftAddedAsCandidateMove = false;
    let castlingRightAddedAsCandidateMove = false;

    for (let i = 0; i <= CONSTANTS.maxWhite; i++) {
      let piece = board[i].piece;

      if (piece === null) {
        continue; // piece has been e.g. eaten
      }
      if (piece.white === false) continue; // it was a black piece...

      let candidateMoves = this.getCandidateMovesForPiece(piece, board);

      if (
        board[CONSTANTS.whiteKingId].piece !== null &&
        this.state.whiteKingMoved === false // it's OK to have only one variable in state for 'whiteKingMoved', as it corresponds the real history i.e. squares (the chosen previous move)
      ) {
        if (
          !castlingLeftAddedAsCandidateMove &&
          !this.state.whiteLeftRookMoved &&
          board[56].piece !== null
        ) {
          if (
            board[57].piece === null &&
            board[58].piece === null &&
            board[59].piece === null &&
            board[56].piece.value === CONSTANTS.WHITE_ROOK_CODE
          ) {
            candidateMoves.push(
              CONSTANTS.whiteKingId + CONSTANTS.CASTLING_QUEEN_SIDE + 58
            ); //add white castling (white king move!) left as a candidate move
            castlingLeftAddedAsCandidateMove = true;
          }
        }
        if (
          !castlingRightAddedAsCandidateMove &&
          !this.state.whiteRightRookMoved
        ) {
          if (
            board[61].piece === null &&
            board[62].piece === null &&
            board[63].piece !== null
          ) {
            candidateMoves.push(
              CONSTANTS.whiteKingId + CONSTANTS.CASTLING_KING_SIDE + 62
            ); //add white castling right (king move!) as a candidate move
            castlingRightAddedAsCandidateMove = true;
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

      if (piece === null) {
        continue; // piece has been e.g. eaten
      }
      if (piece.white === true) continue; // it was white!

      const candidateMoves = this.getCandidateMovesForPiece(piece, board);

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
            // castling constants
            board[1].piece === null &&
            board[2].piece === null &&
            board[3].piece === null
          ) {
            candidateMoves.push(
              CONSTANTS.blackKingId + CONSTANTS.CASTLING_QUEEN_SIDE + 2
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
              CONSTANTS.blackKingId + CONSTANTS.CASTLING_KING_SIDE + 6
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
          candidateCastlingMovesForBlack =
            candidateCastlingMovesForBlack.concat(candidateMoves); // candidateMoves, removalmoves, candidateMoves
        }
      }
    }
    return candidateCastlingMovesForBlack;
  }

  /**
   *
   * @param {*} board
   * @param {*} white
   * @param {*} boardIdx
   * @returns
   */
  getAllowedMovesForBoard(board, white, boardIdx) {
    let candidateMoves = [];
    let allowedMoves = [];
    if (white) {
      candidateMoves = this.getCandidateMovesWhite(board); // add *CHECK* instaed of eating the king!
      allowedMoves = this.getAllowedMovesWhite(board, candidateMoves, boardIdx);
    } else {
      candidateMoves = this.getCandidateMovesBlack(board);
      allowedMoves = this.getAllowedMovesBlack(board, candidateMoves, boardIdx);
    }

    return allowedMoves;
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

    for (let i = 0; i < candidateMovesWhite.length; i++) {
      let whiteKingPosition = pieces[60].currentSquare;

      const whiteCandidateMove = candidateMovesWhite[i];
      let moves = HelpFunctions.getMovesString(candidateMovesWhite[i]);

      const delim = HelpFunctions.getDelim(candidateMovesWhite[i]);

      if (delim === CONSTANTS.CHECK) {
        // candidate move IS check (against black)
        moves = candidateMovesWhite[i].split(CONSTANTS.CHECK);
        board[64] = CONSTANTS.CHECK; // let's FLAG that this board has check!
        candidateBoards[boardIdx] = board;

        this.setState({ candidateBoards }); // we need to update the candidate boards, as there's now check in this board
        console.error(
          "CHECK revised as an possible allowed move, candit move = " +
            whiteCandidateMove
        );
      } else if (delim === CONSTANTS.CASTLING_QUEEN_SIDE) {
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
      } else if (delim === CONSTANTS.CASTLING_KING_SIDE) {
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

      let whiteKingMoveCandidate = false;
      // eslint-disable-next-line
      if (moves[0] == whiteKingPosition) {
        // white king move candidate!
        whiteKingPosition = moves[1];
        whiteKingMoveCandidate = true;
      }

      if (
        this.isWhiteMoveAllowed(
          board,
          whiteKingPosition,
          whiteCandidateMove,
          whiteKingMoveCandidate
        )
      ) {
        allowedMoves.push(whiteCandidateMove);
      }
    } // ..for

    return allowedMoves;
  }

  /**
   *
   * @param {*} board
   * @param {*} candidateMovesBlack
   * @param {*} boardIdx
   * @returns
   */
  getAllowedMovesBlack(board, candidateMovesBlack, boardIdx) {
    let allowedMoves = []; // contains only the candidate moves that were eventually verified to be allowed

    const DLM = CONSTANTS.defaultDelim;
    const blackKingPosition = this.state.pieces[4].currentSquare;

    for (let i = 0; i < candidateMovesBlack.length; i++) {
      const blackCandidateMove = candidateMovesBlack[i];
      /*console.log(
        "candidate move black = " + i + " move = " + candidateMovesBlack[i]
      );*/

      let moves = HelpFunctions.getMovesString(blackCandidateMove);

      if (blackCandidateMove.includes(CONSTANTS.CASTLING_QUEEN_SIDE)) {
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
          allowedMoves.push(blackCandidateMove);
        }
        continue;
      } else if (blackCandidateMove.includes(CONSTANTS.CASTLING_KING_SIDE)) {
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
          allowedMoves.push(blackCandidateMove);
        }
        continue;
      }

      let src = parseInt(moves[0], 10);
      const dst = parseInt(moves[1], 10);
      let kingPosition = blackKingPosition;

      // eslint-disable-next-line
      if (src == kingPosition) {
        // black king move candidate!
        kingPosition = dst;
      }

      if (this.isBlackMoveAllowed(board, kingPosition, blackCandidateMove)) {
        allowedMoves.push(blackCandidateMove);
      } else {
        this.isBlackMoveAllowed(board, kingPosition, blackCandidateMove);
      }
    }
    return allowedMoves;
  }

  /** to check whether a white move is allowed, you need to check opponent's next possible moves
   *if any black move collides with the white king, the white candidate move is rejected immediately
   * @param {*} board
   * @param {*} whiteKingPosition
   * @param {*} whiteCandidateMove
   * @returns
   */
  isWhiteMoveAllowed(board, whiteKingPosition, whiteCandidateMove) {
    let allowed = true;

    for (let i = 0; i <= CONSTANTS.whiteRightRookId; i++) {
      let piece = board[i].piece;

      if (piece === null) {
        continue; // piece has been e.g. eaten or is a pawn
      }

      const value = piece.value;
      let debug = false;

      switch (
        value // only consider black pieces here!
      ) {
        case CONSTANTS.BLACK_PAWN_CODE:
          allowed = MoveFunctions.isAllowedByOpponentBlackPawn(
            piece,
            whiteKingPosition
          );
          if (debug && !allowed) {
            console.log(
              "Not allowed: isAllowedByOpponentBlackPawn" + whiteCandidateMove
            );
          }
          break;
        case CONSTANTS.BLACK_KNIGHT_CODE:
          allowed = MoveFunctions.isAllowedByOpponentKnight(
            piece,
            whiteKingPosition
          );
          if (debug && !allowed) {
            console.log(
              "Not allowed: isAllowedByOpponentBlackKnight" + whiteCandidateMove
            );
          }

          break;
        case CONSTANTS.BLACK_BISHOP_CODE:
          allowed = MoveFunctions.isAllowedByOpponentBishop(
            piece,
            board,
            whiteKingPosition,
            whiteCandidateMove
          );
          //console.log("allowed by black bishop = " + allowed + " move = " + whiteCandidateMove + " WKP =" + whiteKingPosition);
          if (debug && !allowed) {
            // console.log("Not allowed: isAllowedByOpponentBlackBishop" + whiteCandidateMove);
          }
          break;
        case CONSTANTS.BLACK_ROOK_CODE:
          allowed = MoveFunctions.isAllowedByOpponentRook(
            piece,
            board,
            whiteKingPosition,
            whiteCandidateMove
          );
          if (debug && !allowed) {
            console.log(
              "Not allowed: isAllowedByOpponentBlackRook" + whiteCandidateMove
            );
          }
          break;
        case CONSTANTS.BLACK_KING_CODE:
          allowed = MoveFunctions.isAllowedByOpponentKing(
            piece,
            whiteKingPosition
          );
          if (debug && !allowed) {
            console.log(
              "Not allowed: isAllowedByOpponentBlackKing" + whiteCandidateMove
            );
          }
          break;
        case CONSTANTS.BLACK_QUEEN_CODE:
          allowed = MoveFunctions.isAllowedByOpponentQueen(
            piece,
            board,
            whiteKingPosition,
            whiteCandidateMove
          );
          if (debug && !allowed) {
            console.log(
              "Not allowed: " +
                whiteCandidateMove +
                "*isAllowedByOpponentBlackQueen*" +
                whiteCandidateMove
            );
          }
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
  /**
   *
   * @param {*} board
   * @param {*} blackKingPosition
   * @param {*} blackCandidateMove
   * @returns
   */
  isBlackMoveAllowed(board, blackKingPosition, blackCandidateMove) {
    let allowed = true;

    for (let i = 0; i <= 63; i++) {
      const piece = board[i].piece;

      if (piece === null) {
        continue; // piece has been e.g. eaten
      }

      let debug = false;
      switch (
        piece.value // we must ensure we're considering ONLY white pieces here!
      ) {
        case CONSTANTS.WHITE_PAWN_CODE:
          allowed = MoveFunctions.isAllowedByOpponentWhitePawn(
            piece,
            blackKingPosition
          );
          if (debug && !allowed) {
            console.log(
              "Not allowed: isAllowedByOpponentWhitePawn" + blackCandidateMove
            );
          }
          break;
        case CONSTANTS.WHITE_KNIGHT_CODE:
          allowed = MoveFunctions.isAllowedByOpponentKnight(
            piece,
            blackKingPosition
          );
          if (debug && !allowed) {
            console.log(
              "Not allowed: isAllowedByOpponentWhiteKnight" + blackCandidateMove
            );
          }
          break;
        case 4:
          allowed = MoveFunctions.isAllowedByOpponentBishop(
            piece,
            board,
            blackKingPosition,
            blackCandidateMove
          );
          if (debug && !allowed) {
            console.log(
              "Not allowed: isAllowedByOpponentWhiteBishop" + blackCandidateMove
            );
          }
          break;
        case 5:
          allowed = MoveFunctions.isAllowedByOpponentRook(
            piece,
            board,
            blackKingPosition,
            blackCandidateMove
          );
          if (debug && !allowed) {
            console.log(
              "Not allowed: isAllowedByOpponentWhiteRook" + blackCandidateMove
            );
          }
          break;
        case 6:
          allowed = MoveFunctions.isAllowedByOpponentKing(
            piece,
            blackKingPosition
          );
          if (debug && !allowed) {
            console.log(
              "Not allowed: isAllowedByOpponentWhiteKing" + blackCandidateMove
            );
          }
          break;
        case 9:
          allowed = MoveFunctions.isAllowedByOpponentQueen(
            piece,
            board,
            blackKingPosition,
            blackCandidateMove
          );
          if (debug && !allowed) {
            console.log(
              "Not allowed: " +
                blackCandidateMove +
                " ** isAllowedByOpponentWhiteQueen"
            );
          }
          break;
        default:
          break;
      }
      if (!allowed) return false; // have to return immediately if the move wasn't allowed! (no need to continue checking against other pieces)
    } // ..for
    return allowed;
  }

  prevTurn() {
    this.setState(
      {
        currentBoardSquares: this.state.previousBoards.pop(),
        white: !this.state.white,
        nextTurn: this.state.nextTurn - 1,
      },
      function () {
        if (this.state.DEBUG) {
          console.log(
            "state update complete, prevTurn : " + this.state.prevTurn
          );
        }
      }
    );
  }

  nextTurn() {
    let {
      currentBoardSquares: squares,
      white,
      candidateBoards,
      pieces,
    } = this.state;
    const previousBoard = _.cloneDeep(squares);
    this.state.previousBoards.push(previousBoard); // stack of previous boards, Lodash deep clone is required!

    const candidateMoves = this.getCandidateMoves(white, squares);
    let allowedMoves = this.getAllowedMoves(white, squares, candidateMoves);

    // eslint-disable-next-line
    if (allowedMoves === null || allowedMoves.length == 0) {
      if (white) {
        console.log(
          "Game over, black wins. candidateMoves = " +
            candidateMoves +
            " allowedMoves l = " +
            allowedMoves.length
        );
      } else {
        console.log("Game over, white wins. ");
      }
      document.getElementById("next").disabled = true;
      return;
    }

    if (this.state.DEBUG) {
      console.log(
        " WHITE = " + white + " allowed moves:" + allowedMoves.join("|")
      );
    }
    let numberOfPossibleNextMoves = [];
    let maxIdx = 0;
    let max = 0;
    let threatScore = 1000;
    let minThreatScoreBoardIndex = -1;

    // board will be stored to boards array (state)
    //Lodash deep clone is required, as the array contains objects (i.e. pieces)
    //https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089

    for (let i = 0; i < allowedMoves.length; ++i) {
      // each allowed move corresponds one candidateBoard, that is, their indexes are synchronized
      candidateBoards[i] = this.getCandidateBoardCorrespondingAllowedMove(
        allowedMoves[i],
        _.cloneDeep(squares),
        white
      ); // check that all kind of special moves are dealt as well (e.g. castling and its restrictiones)

      const allowedMovesForBoard = this.getAllowedMovesForBoard(
        candidateBoards[i],
        white,
        i
      );

      let threatScoreForBoard = getTotalOpponentThreatScoreAgainstMe(
        candidateBoards[i],
        white
      );
      console.log(
        "threat score for allowed (candidate) board index " +
          i +
          " move= " +
          allowedMoves[i] +
          " = " +
          threatScoreForBoard +
          " white = " +
          white
      );

      if (threatScoreForBoard < threatScore) {
        threatScore = threatScoreForBoard;
        minThreatScoreBoardIndex = i;
      }
      numberOfPossibleNextMoves[i] = allowedMovesForBoard.length;

      if (this.state.DEBUG) {
        console.log(
          "White previous move:" +
            allowedMoves[i] +
            " | Points = " +
            numberOfPossibleNextMoves[i] +
            " | board number = " +
            i
        );
      }
    } // ..for

    maxIdx = this.getMaxMovesIndexWhileAvoidingStalemate(
      white,
      candidateBoards,
      allowedMoves,
      numberOfPossibleNextMoves
    );

    // this will be the final selected move for white / black determined by the heuristics / strategy
    let selectedMove = MoveFunctions.getBestMove(squares, allowedMoves);

    if (selectedMove === null) {
      maxIdx = minThreatScoreBoardIndex;
      //selectedMove = allowedMoves[maxIdx];
      //max = numberOfPossibleNextMoves[maxIdx];
      console.log(
        "maxIdx=" +
          maxIdx +
          " minThreatScoreBoardIdx=" +
          minThreatScoreBoardIndex
      );
      selectedMove = allowedMoves[minThreatScoreBoardIndex]; // select the proper heuristics
    }

    let checkMoves = CheckFunctions.getCheckMoves(allowedMoves);
    if (checkMoves.length > 0) {
      selectedMove = checkMoves[0]; // just take the first check move
    } else {
      selectedMove = allowedMoves[minThreatScoreBoardIndex]; // strategy is just to select the lowest threat score against black
    }
    console.log("sel check move = " + selectedMove);
    maxIdx = allowedMoves.indexOf(selectedMove);

    if (this.state.DEBUG) {
      console.log(
        "selected move black = " +
          selectedMove +
          " possible moves length = " +
          numberOfPossibleNextMoves.length
      );
    }

    if (this.state.DEBUG) {
      console.log("boards = " + candidateBoards.length);
      console.log(
        "max = " +
          max +
          " max_idx = " +
          maxIdx +
          " real max value = " +
          allowedMoves[maxIdx]
      );
    }

    const movesStringFromSelectedMove =
      HelpFunctions.getMovesString(selectedMove); // TODO: how about castling and en passe?

    if (this.state.DEBUG) {
      console.log("moveStr = " + movesStringFromSelectedMove);
    }
    const pieceNumberId =
      candidateBoards[maxIdx][movesStringFromSelectedMove[1]].piece.n;

    /* eslint-disable */
    if (
      pieceNumberId == CONSTANTS.whiteKingId ||
      pieceNumberId == CONSTANTS.blackKingId
    ) {
      /* eslint-enable */
      // king moved
      pieces[pieceNumberId].currentSquare = parseInt(
        movesStringFromSelectedMove[1],
        10
      );
    } else if (
      white &&
      pieceNumberId > CONSTANTS.whiteRightRookId &&
      pieceNumberId < 70
    ) {
      // white promoted queen = [63, 69]
      console.error("UPDATE next promoted WHITE queen number!!");
      this.setState({
        promotedWhiteQueenNumber: ++this.state.promotedWhiteQueenNumber,
      });
    } else if (
      !white &&
      pieceNumberId < 0 &&
      pieceNumberId <= CONSTANTS.BLACK_QUEEN_CODE
    ) {
      this.setState({
        promotedBlackQueenNumber: --this.state.promotedBlackQueenNumber,
      });
    } // TODO: add underpromotion piece number counters! (white & black)

    this.handleCastlingAllowedCondition(
      squares[movesStringFromSelectedMove[0]]
    ); // we need to check if the selected move caused restrictions that block future castling

    this.setState(
      {
        pieces,
        candidateBoards,
        currentBoardSquares: candidateBoards[maxIdx],
        white: !white,
        nextTurn: this.state.nextTurn + 1,
      },
      function () {
        if (this.state.DEBUG) {
          console.log(
            "state update complete, nextTurn : " + this.state.nextTurn
          );
        }
      }
    );
  } // nextTurn

  /**
   *
   * @param {*} isWhiteTurn
   * @param {*} candidateBoards
   * @param {*} allowedMoves
   * @param {*} numberOfPossibleNextMoves
   * @returns
   */
  getMaxMovesIndexWhileAvoidingStalemate(
    isWhiteTurn,
    candidateBoards,
    allowedMoves,
    numberOfPossibleNextMoves
  ) {
    let max = 0;
    let maxIdx = 0;

    for (let i = 0; i < candidateBoards.length; ++i) {
      if (candidateBoards[i][64] === CONSTANTS.CHECK) {
        let numberOfAllowedOpponentMoves = this.getNumberOfAllowedOpponentMoves(
          isWhiteTurn,
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
        isWhiteTurn,
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
        isWhiteTurn,
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

  getNumberOfAllowedOpponentMoves(white, index, candidateBoards) {
    let allowedOpponentMoves = [];
    let candidateOpponentMoves = [];

    if (white) {
      candidateOpponentMoves = this.getCandidateMovesBlack(
        candidateBoards[index]
      );
      //console.log("candit opponent moves = " + candidateOpponentMoves.length);
      // add heuristics to ADD or REDUCE points based on good/bad moves!
      // e.g. if opponent can capture queen with a rook -> reduce points
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

  // castling won't be allowed if the king has moved already!
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
        <div className="nextturn">
          <NextTurn nextTurn={this.nextTurn} next={this.state.nextTurn} />
        </div>
        <div className="prevturn">
          <PrevTurn prevTurn={this.prevTurn} next={this.state.nextTurn} />
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
