import React from "react";
import Square from "./Square";
import NextMove from "./NextMove";
import PrevMove from "./PrevMove";

import CONSTANTS from "../config/constants";
import Moves from "./Moves";
import _ from "lodash";

class Chess extends Moves {
  constructor(props) {
    super(props);
    this.state = {
      //TODO: boards[0] could be 'squares' and next move possibilities could start from index 1
      currentBoardSquares: [], // current board squares; all next turn possibilities will create a separate (candidate) board
      candidateBoards: [], // each board has different squares, there are as many boards as there are allowed move possibilities per a turn
      pieces: {},
      staleMateQueenWarning: false,

      // promotions
      promotedWhiteQueenNumber: CONSTANTS.maxWhite + 1,
      promotedBlackQueenNumber: -1,

      // underpromotions
      promotedWhiteRookNumber: CONSTANTS.maxWhite + 1,
      promotedBlackRookNumber: -1,
      promotedWhiteBishopNumber: CONSTANTS.maxWhite + 1,
      promotedBlackBishopNumber: -1,
      promotedWhiteKnightNumber: CONSTANTS.maxWhite + 1,
      promotedBlacKnightNumber: -1,

      white: true,
      previousBoards: [], // array (stack with push/pop) of previous boards
      nextMove: 1,

      previousMove: null, // TODO: possible needed for checking allowance for en passat

      // TODO: need to check king/rook movements BOTH globally (squares) and locally (current board allowed move)
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
    this.nextMove = this.nextMove.bind(this);
    this.prevMove = this.prevMove.bind(this);
  }

  getWhiteKingPosition(board) {
    for (let i = 63; i >= 0; i--) {
      if (
        board[i].piece !== null &&
        board[i].piece.type === CONSTANTS.WHITE_KING
      ) {
        return i;
      }
    }
  }
  getBlackKingPosition(board) {
    for (let i = 0; i <= 63; i++) {
      if (
        board[i].piece !== null &&
        board[i].piece.type === CONSTANTS.BLACK_KING
      ) {
        return i;
      }
    }
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

  getCandidateBoardCorrespondingAllowedMove(allowedMove, board, white) {
    let moves = allowedMove.split(CONSTANTS.defaultDelim); // src = moves[0], dst = moves[1]

    if (allowedMove.includes(CONSTANTS.promotionToQueen)) {
      moves = allowedMove.split(CONSTANTS.promotionToQueen); // src = moves[0], dst = moves[1]
      if (white) {
        // white promotion to queen!
        let { pieces, promotedWhiteQueenNumber } = this.state;
        board[moves[1]].piece = pieces[promotedWhiteQueenNumber];
        board[moves[1]].piece.currentSquare = moves[1];
        board[moves[0]].piece = null;
      } else {
        // black promotion to queen!
        let { pieces, promotedBlackQueenNumber } = this.state;
        board[moves[1]].piece = pieces[promotedBlackQueenNumber];
        board[moves[1]].piece.currentSquare = moves[1];
        board[moves[0]].piece = null;
      }
    } else if (allowedMove.includes(CONSTANTS.promotionToRook)) {
      // TODO: add all underpromotions!
      moves = allowedMove.split(CONSTANTS.promotionToRook); // src = moves[0], dst = moves[1]
    } else if (allowedMove.includes(CONSTANTS.promotionToBishop)) {
      moves = allowedMove.split(CONSTANTS.promotionToBishop); // src = moves[0], dst = moves[1]
    } else if (allowedMove.includes(CONSTANTS.promotionToKnight)) {
      moves = allowedMove.split(CONSTANTS.promotionToKnight); // src = moves[0], dst = moves[1]
    } else if (allowedMove.includes(CONSTANTS.castlingQueenSide)) {
      moves = allowedMove.split(CONSTANTS.castlingQueenSide);
      this.castleQueenSideAllowedBoard(white, board); // castle queen side was the allowed move, create the corresponding board
    } else if (allowedMove.includes(CONSTANTS.castlingKingSide)) {
      moves = allowedMove.split(CONSTANTS.castlingKingSide);
      this.castleKingSideAllowedBoard(white, board);
    } else {
      // normal move

      board[moves[1]].piece = board[moves[0]].piece; // the move: dst square's piece becomes src square's piece
      board[moves[1]].piece.currentSquare = moves[1];
      board[moves[0]].piece = null; // the original src piece has moved, so the square doesn't have its peace anymore
    }
    return board;
  }

  doBasicMove(srcSquare, dstSquare) {
    dstSquare.piece = srcSquare.piece; // this handles a capture as well!
    srcSquare.piece = null;
  }
  doEnPasse(srcSquare, dstSquare, pieceToBeRemovedSquare) {
    dstSquare.piece = srcSquare.piece; // this handles a capture as well!
    srcSquare.piece = null;
    pieceToBeRemovedSquare = null;
  }

  castleQueenSideAllowedBoard(white, board) {
    if (white) {
      console.log("WHITE queen side castling allowed...");
      this.castleQueenSideWhite(board);
      //this.setState({ whiteKingMoved: true });
    } else {
      this.castleQueenSideBlack(board);
      //this.setState({ blackKingMoved: true });
    }
  }
  castleKingSideAllowedBoard(white, board) {
    if (white) {
      this.castleKingSideWhite(board);
      //this.setState({ whiteKingMoved: true });
    } else {
      this.castleKingSideBlack(board);
      //this.setState({ blackKingMoved: true });
    }
    return board;
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
  }

  castleQueenSide(white, board) {
    console.log("castle queen side, white = " + white);
    if (white) {
      this.castleQueenSideWhite(board);
      this.setState({ whiteKingMoved: true });
    } else {
      this.castleQueenSideBlack(board);
      this.setState({ blackKingMoved: true });
    }
  }

  castleKingSide(white, board) {
    console.log("castle king side, white = " + white);

    if (white) {
      this.castleKingSideWhite(board);
      this.setState({ whiteKingMoved: true });
    } else {
      this.castleKingSideBlack(board);
      this.setState({ blackKingMoved: true });
    }
    return board;
  }

  // board needs to be constructed before pieces are added
  initBoard() {
    const squares = [];

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

    this.props.setupPieceData.forEach((item) => {
      //console.log('item='+item);
      let piece = {
        currentSquare: item[0], // number 0..63, changes
        type: item[1], // actual piece, e.g. RookBA
        id: item[2], // piece id, e.g. bra
        n: item[3], // ORIGINAL number 0..63, won't change (unique identifier)
        white: item[4], // true if white
        value: item[5], // piece value ( black has negative corresponding values)
        //value: //exact piece value in relation to other pieces
      };

      if (item[0] >= 0 && item[0] <= CONSTANTS.maxWhite) {
        currentBoardSquares[item[0]].piece = piece;
      }
      pieces[piece.n] = piece;
    });

    this.setState({ pieces: pieces });
    //this.makeNumberOfMoves(3); // check game over condition!
  }

  makeNumberOfMoves(n) {
    if (!this.gameOver) {
      for (let i = 0; i < n; i++) {
        this.nextMove(i + 1);
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
    let candidateMovesBlack = [];
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
        if (!castlingLeftAdded && !this.state.blackLeftRookMoved) {
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
        if (!castlingRightAdded && !this.state.blackRightRookMoved) {
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
        candidateMovesBlack.length === undefined
      ) {
        //FIXME,candidateMovesBlack was null
        candidateMovesBlack = candidateMoves;
      } else if (candidateMoves.length > 0) {
        if (!candidateMovesBlack.includes(candidateMoves)) {
          candidateMovesBlack = candidateMovesBlack.concat(candidateMoves); // candidateMoves, removalmoves, candidateMoves
        }
      }
    }
    return candidateMovesBlack;
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
  getNumberOfAllowedMovesFromThisBoardPosition(board, white) {
    let candidateMoves = [];
    let allowedMoves = [];
    if (white) {
      candidateMoves = this.getCandidateMovesWhite(board);
      allowedMoves = this.getAllowedMovesWhite(board, candidateMoves);
      if (board[26].piece !== null && board[26].piece.value === 9) {
        console.log("max allowed moves? = " + allowedMoves.length);
      }
    } else {
      candidateMoves = this.getCandidateMovesBlack(board);
      allowedMoves = this.getAllowedMovesBlack(board, candidateMoves);
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
  getAllowedMovesWhite(board, candidateMovesWhite) {
    let allowedMoves = []; // contains only the candidate moves that were eventually verified to be allowed
    const whiteKingPosition = this.getWhiteKingPosition(board);
    const P = CONSTANTS.enPasse;
    const DLM = CONSTANTS.defaultDelim;

    for (let i = 0; i < candidateMovesWhite.length; i++) {
      const str = candidateMovesWhite[i];
      let move = null;

      if (str.includes(DLM)) {
        //continue; // TODO, remove this to allow other moves
        move = candidateMovesWhite[i].split(DLM);
      } else if (str.includes(CONSTANTS.promotionToQueen)) {
        move = candidateMovesWhite[i].split(CONSTANTS.promotionToQueen);
      } else if (str.includes(CONSTANTS.promotionToRook)) {
        move = candidateMovesWhite[i].split(CONSTANTS.promotionToRook);
      } else if (str.includes(CONSTANTS.promotionToBishop)) {
        move = candidateMovesWhite[i].split(CONSTANTS.promotionToBishop);
      } else if (str.includes(CONSTANTS.promotionToKnight)) {
        move = candidateMovesWhite[i].split(CONSTANTS.promotionToKnight);
      } else if (str.includes(P)) {
        // en passe
        move = candidateMovesWhite[i].split(P);
      } else if (str.includes(CONSTANTS.castlingQueenSide)) {
        console.log("Checking allowance of white queen side castling...");
        let blackCandidateMoves = this.getCandidateMovesBlack(board);

        let allowLeftCastling = true; //TODO: should initially be false?!
        const re = /.60|.59|.58|.57/g; // numbers of the not-allowed squares

        for (let i = 0; i < blackCandidateMoves.length; i++) {
          const canditMove = blackCandidateMoves[i];
          //console.log('castling check: black move match: ' + canditMove + ' re = ' + re);
          let match = canditMove.match(re);

          if (match !== null) {
            console.log(
              "castling check: white left castling NOT allowed, candit =" +
                str +
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
          allowedMoves.push(str); // TODO, continue!!!
          // console.log("castling check: left castling allowed, str =" + str);
        }
        continue; // no further allowance checks required!
      } else if (str.includes(CONSTANTS.castlingKingSide)) {
        let blackCandidateMoves = this.getCandidateMovesBlack(board);
        let allowKingSideCastling = true;
        const re = /.60|.61|.62/g; // numbers of the not-allowed squares

        for (let i = 0; i < blackCandidateMoves.length; i++) {
          const canditMove = blackCandidateMoves[i];
          if (canditMove.match(re) !== null) {
            allowKingSideCastling = false;
            console.log(
              "castling check: right castling NOT allowed, candit =" + str
            );
            break;
          }
        }
        if (allowKingSideCastling) {
          allowedMoves.push(str);
        }
        continue;
      }

      const src = 1 * move[0];
      const dst = 1 * move[1];
      let kingPosition = 1 * whiteKingPosition;

      if (src === kingPosition) {
        // white king move candidate!
        kingPosition = dst;
      }
      if (this.isWhiteMoveAllowed(board, kingPosition, str)) {
        allowedMoves.push(str);
      }
    } // ..for

    return allowedMoves;
  }

  getAllowedMovesBlack(board, candidateMovesBlack) {
    let allowedMoves = []; // contains only the candidate moves that were eventually verified to be allowed
    const P = CONSTANTS.enPasse;
    const DLM = CONSTANTS.defaultDelim;
    const blackKingPosition = this.getBlackKingPosition(board);

    for (let i = 0; i < candidateMovesBlack.length; i++) {
      const str = candidateMovesBlack[i];

      let move = null;

      if (str.includes(DLM)) {
        //continue; // TODO, remove this to allow other moves than castling
        move = candidateMovesBlack[i].split(DLM); // [1] === dst move
      } else if (str.includes(P)) {
        move = candidateMovesBlack[i].split(P);
      } else if (str.includes(CONSTANTS.castlingQueenSide)) {
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

      let src = 1 * move[0];
      const dst = 1 * move[1];
      let kingPosition = 1 * blackKingPosition;

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
        case -1:
          allowed = this.isAllowedByOpponentBlackPawn(piece, whiteKingPosition);
          break;
        case -3:
          allowed = this.isAllowedByOpponentKnight(piece, whiteKingPosition);
          break;
        case -4:
          allowed = this.isAllowedByOpponentBishop(
            piece,
            board,
            whiteKingPosition,
            whiteCandidateMove
          );
          break;
        case -5:
          allowed = this.isAllowedByOpponentRook(
            piece,
            board,
            whiteKingPosition,
            whiteCandidateMove
          );
          break;
        case -6:
          allowed = this.isAllowedByOpponentKing(piece, whiteKingPosition);
          break;
        case -9:
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

  nextMove(nextMove) {
    const P = CONSTANTS.enPasse;
    const DLM = CONSTANTS.defaultDelim;
    this.setState({ nextMove: nextMove });

    let { currentBoardSquares: squares, white, candidateBoards } = this.state;
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
      candidateBoards[i] = this.getCandidateBoardCorrespondingAllowedMove(
        allowedMoves[i],
        _.cloneDeep(squares),
        white
      ); //TODO, check that all kind of special moves are dealt as well (e.g. castling and its restrictiones)

      numberOfPossibleNextMoves[
        i
      ] = this.getNumberOfAllowedMovesFromThisBoardPosition(
        candidateBoards[i],
        white
      );

      /*console.log(
        "White previous move:" +
          allowedMoves[i] +
          " | Points=" +
          numberOfPossibleNextMoves[i] +
          " | board number = " +
          i
      );*/
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
      max = numberOfPossibleNextMoves.length;
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

    let moveStr = selectedMove.split(CONSTANTS.defaultDelim); // move = src->dst

    if (white && candidateBoards[maxIdx][moveStr[1]].piece.n > 63) {
      console.error("UPDATE next promoted WHITE queen number!!");
      this.setState({
        promotedWhiteQueenNumber: ++this.state.promotedWhiteQueenNumber,
      });
    } // TODO: add black promotion handling

    if (selectedMove.includes(DLM)) {
      console.log(
        "SELECTED MOVE = " +
          allowedMoves[maxIdx] +
          "src = " +
          moveStr[0] +
          "dst = " +
          moveStr[1]
      );
      //this.doBasicMove(srcSquare, dstSquare); // let's do the move that had the most possible moves as the next move; includes captures
    } else if (selectedMove.includes(CONSTANTS.castlingQueenSide)) {
      // this.castleQueenSide(white, squares); // TODO, not needed!
    } else if (selectedMove.includes(CONSTANTS.castleKingSide)) {
      // this.castleKingSide(white, squares); // TODO, not needed, as part of the selected BOARD!
    } else if (selectedMove.includes(P)) {
      // en passe

      moveStr = selectedMove.split(P);
      let srcSquare = squares[moveStr[0]];
      let dstSquare = squares[moveStr[1]];
      let pieceToBeRemovedSquare = null;

      if (dstSquare === srcSquare + CONSTANTS.downLeft) {
        pieceToBeRemovedSquare = srcSquare + CONSTANTS.left;
      } else if (dstSquare === srcSquare + CONSTANTS.downRight) {
        pieceToBeRemovedSquare = srcSquare + CONSTANTS.right;
      } else if (dstSquare === srcSquare + CONSTANTS.upLeft) {
        pieceToBeRemovedSquare = srcSquare + CONSTANTS.left;
      } else if (dstSquare === srcSquare + CONSTANTS.upRight) {
        pieceToBeRemovedSquare = srcSquare + CONSTANTS.right;
      }
      this.doEnPasse(srcSquare, dstSquare, pieceToBeRemovedSquare);
    }

    this.handleCastlingAllowedCondition(squares[moveStr[0]]);

    this.setState(
      {
        candidateBoards: candidateBoards,
        currentBoardSquares: candidateBoards[maxIdx],
        white: !white,
      },
      function () {
        //console.log("setState completed", this.state);
      }
    );
  }

  getMaxMovesIndexWhileAvoidingStalemate(
    white,
    candidateBoards,
    allowedMoves,
    numberOfPossibleNextMoves
  ) {
    let max = 0;
    let maxIdx = 0;

    //console.log("Rook board = " + candidateBoards[1][5].type);
    for (let i = 0; i < candidateBoards.length; ++i) {
      if (numberOfPossibleNextMoves[i] > max) {
        max = numberOfPossibleNextMoves[i]; // select the move from the allowed moves which got the highest points
        //console.log("max = " + max + " idx = " + i);
        maxIdx = i;
      }
    }

    let candidateOpponentMoves;
    let allowedOpponentMoves;
    if (white) {
      candidateOpponentMoves = this.getCandidateMovesBlack(
        candidateBoards[maxIdx]
      );
      allowedOpponentMoves = this.getAllowedMovesBlack(
        candidateBoards[maxIdx],
        candidateOpponentMoves
      );
    } else {
      candidateOpponentMoves = this.getCandidateMovesWhite(
        candidateBoards[maxIdx]
      );
      allowedOpponentMoves = this.getAllowedMovesWhite(
        candidateBoards[maxIdx],
        candidateOpponentMoves
      );
    }

    if (allowedOpponentMoves.length === 0) {
      // opponent can't move -> stalemate!
      const { pieces } = this.state;
      console.log(
        "STALEMATE PREVENTION, SKIP THIS MOVE: " + allowedMoves[maxIdx]
      );
      let moves = allowedMoves[maxIdx].split(CONSTANTS.defaultDelim);
      let board = candidateBoards[maxIdx];
      if (white && moves[1] <= 7) {
        // white promotion!
        board[moves[1]].piece = pieces[72]; // underpromotion to a knight to avoid stalemate
        board[moves[1]].piece.currentSquare = moves[1];
      } else if (!white && moves[1] >= 56) {
        board[moves[1]].piece = pieces[-9]; // underpromotion to a knight to avoid stalemate
        board[moves[1]].piece.currentSquare = moves[1];
      } else {
        numberOfPossibleNextMoves.splice(maxIdx, 1); // remove allowedMoves[maxIdx] from the array to avoid stalemate
        candidateBoards.splice(maxIdx, 1);
        allowedMoves.splice(maxIdx, 1); // to get the counter right, we need to remove from here too

        maxIdx = this.getMaxMovesIndexWhileAvoidingStalemate(
          white,
          candidateBoards,
          allowedMoves,
          numberOfPossibleNextMoves
        ); // recursion is OK here
      }
      //this.setState({currentBoardSquares: board, candidateBoards: candidateBoards});
    }
    console.log(
      "returning: max = " +
        max +
        " max_idx=" +
        maxIdx +
        " numberOfPossibleNextMoves = " +
        numberOfPossibleNextMoves
    );
    return maxIdx;
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
          <NextMove nextMove={this.nextMove} />
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
