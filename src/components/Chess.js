import React from "react";
import NextPly from "./NextPly";
import Square from "./Square";

import CONSTANTS from "../config/constants";
import PrevPly from "./PrevPly";

import * as Heuristics from "./Heuristics";
import * as MoveFunctions from "./MoveFunctions";
import * as ScoreSumProcessor from "./ScoreSumProcessor";

import * as CastlingFunctions from "./CastlingFunctions";
import * as CheckFunctions from "./CheckFunctions";
import * as EnPassantFunctions from "./EnPassantFunctions";
import * as HelpFunctions from "../utils/HelpFunctions";
import * as PromotionFunctions from "./PromotionFunctions";
import * as ThreatScores from "./ThreatScores";

//import { doublePawnPointsHandling } from "./Heuristics";
import _ from "lodash";

/**
 * General board & chess setup & move allowances. All state setting happens here.
 */
class Chess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DEBUG: false,
      LOGGING: false,
      plies: [], // white and black half-moves
      arrayOfCandidateBoards: [],
      white: CONSTANTS.WHITE_STARTS, // white starts by default
      currentBoard: [], // current board squares; all next turn possibilities will create a separate (candidate) board
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
      promotedBlackKnightNumber: -30,

      previousBoards: [], // array (stack with push/pop) of previous boards
      nextPly: 1, // 'pointer' to the next turn number (initially will be 1)

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
    this.nextPly = this.nextPly.bind(this);
    this.prevPly = this.prevPly.bind(this);
  } // constructor

  componentDidMount() {
    this.initBoard();
    document.getElementById("previous").disabled = true;
  }

  /**
   * Does set state.
   * @returns
   */
  nextPly() {
    const DEEPNESS = 5; // 3 = -BLACK + WHITE - BLACK

    let { currentBoard: board, white, candidateBoards, pieces } = this.state;

    const previousBoard = _.cloneDeep(board);
    this.state.previousBoards.push(previousBoard); // stack of previous boards, Lodash deep clone is required!

    const candidateMoves = white
      ? this.getCandidateMovesWhite(board)
      : this.getCandidateMovesBlack(board);

    const allowedMoves = this.getAllowedMoves(white, board, candidateMoves);
    candidateBoards = this.getCandidateBoards(allowedMoves, board, white);
    //console.log("candidateMoves:" + candidateMoves);
    console.log("allowedMoves:" + allowedMoves); // TODO: fix bug; not capturing a checking queen with a pawn!
    // Nov 2023, use minMax without deepness at this point
    const bestNextBoardIndexNumber =
      this.getCandidateboardIndexWithMinMaxNextMoves(
        allowedMoves,
        candidateBoards,
        white
      ); //  getCandidateboardIndexWithMaxOwnNextMoves(candidateBoards, white);
    /*console.log(
      "WHITE = " +
      white +
      " Number of  Candidate boards: " +
      candidateBoards.length +
      " DEEPNESS = " +
      DEEPNESS
    ); */

    if (this.gameOver(candidateMoves, allowedMoves, white)) {
      return; // return as game over
    } // handle game over condition and ritual

    if (this.state.DEBUG) {
      console.log(
        " WHITE = " + white + " allowed moves:" + allowedMoves.join("|")
      );
    }

    /*const compoundArray = this.getArrayOfCandidateBoardsArrays(
      white,
      board,
      DEEPNESS
    ); // includes also root score array!


    const indexOfBestBoard = ScoreSumProcessor.getMinMaxScoreIndex(
      compoundArray[0]
    ); // we need original score arrays here!
    console.log(
      "Index of board having the best HEURISTICS SCORE: " + indexOfBestBoard
    );
*/
    //4, 97, 1619, 36348, 876731  -> 4, 97, 1625, 36579, 884718 (28.11.23)
    //const totalNumberOfCandidateBoards = this.getTotalNumberOfCandidateBoards(compoundArray); // compoundArray?
    //const totalNumberOfCandidateBoards  = this.getTotalNumberOfCandidateBoards(arrayOfCandidateBoardsArrays); // compoundArray?
    //console.log("total number of CandidateBoards: " + totalNumberOfCandidateBoards); //TODO deep 5 = 876731 vs. 38064 = 36348 + 1619 + 97
    /*
    let bestNextBoardIndexNumber2 =
      DEEPNESS === 1
        ? indexOfBestBoard
        : this.getNextMoveBoardIndexForAbsoluteBoardNumber(
            DEEPNESS,
            indexOfBestBoard,
            compoundArray[0],
            white
          );
    console.log(
      "best next board IDX number = " + bestNextBoardIndexNumber + " RETURNING"
    );
*/
    /*const numberOfPossibleNextMoves = this.getNumberOfAllowedNextMovesForBoard(
    candidateBoards,
    white
  );*/

    /*const threatScoreForCandidateboards =
    ThreatScores.getThreatScoreForCandidateBoards(candidateBoards, white);
  const optimalThreatScoreBoardIndex =
    ThreatScores.getOptimalThreatScoreBoardIndex(
      threatScoreForCandidateboards,
      white
    );
*/
    // TODO: check the purpose of this call as maxIdx is redefined afterwards
    /*const staleMateAvoidingMaxIdx =
    this.getMaxMovesIndexWhileNotAllowingStalemate(
      white,
      candidateBoards,
      allowedMoves,
      numberOfPossibleNextMoves
    );
*/
    // this will be the final selected move for white / black determined by the heuristics / strategy
    const selectedMove = allowedMoves[bestNextBoardIndexNumber];

    console.log(
      "Selected IDX: " + bestNextBoardIndexNumber + " | MOVE:" + selectedMove
    );
    //    let pieceNumberId;

    /* if (
    candidateBoards[staleMateAvoidingMaxIdx][movesStringFromSelectedMove[1]]
      .piece !== null
  ) {
    pieceNumberId =
      candidateBoards[staleMateAvoidingMaxIdx][movesStringFromSelectedMove[1]]
        .piece.n;
  } else { 
    pieceNumberId =
      candidateBoards[selectedMoveIndex][movesStringFromSelectedMove[1]].piece
        .n;
    console.error(
      " SelectedMoveIndex = " +
        selectedMoveIndex +
        " moveIDX=" +
        movesStringFromSelectedMove[1]
    );
  //}
  this.setStatesOfKingMovementAndPromotion(
    pieceNumberId,
    pieces,
    movesStringFromSelectedMove,
    white
  );
*/
    //   this.setStatesOfCastlingMoves(board[movesStringFromSelectedMove[0]]); // we need to check if the selected move caused restrictions that block future castling
    //candidateBoards[selectedMoveIndex]
    this.setState({
      pieces,
      candidateBoards,
      currentBoard: candidateBoards[bestNextBoardIndexNumber],
      white: !white,
      nextPly: this.state.nextPly + 1,
    });
  } // nextPly

  /**
   * Does set state.
   */
  prevPly() {
    this.setState({
      currentBoard: this.state.previousBoards.pop(),
      white: !this.state.white,
      nextPly: this.state.nextPly - 1,
    });
  }

  // distance of this candidate move
  getMoveDistance(board, allowedMove) {
    let move = HelpFunctions.getMovesString(allowedMove);

    let sr = HelpFunctions.getRowForSquareNumber(parseInt(move[0], 10));
    let sc = HelpFunctions.getColForSquareNumber(parseInt(move[0], 10));
    let dr = 1 + board[parseInt(move[1], 10)].row;
    let dc = 1 + board[parseInt(move[1], 10)].col;

    let distanceRow = Math.abs(sr - dr);
    let distanceCol = Math.abs(sc - dc);
    return distanceRow + distanceCol;
  }

  /**
   * Iterative method using STACK for getting all possible moves (numberOfPlies = deep)
   * @param {*} arrayOfCandidateBoards
   * @param {*} white 1. white 2. black 3. white, 4. black, etc.
   */
  addCandidateBoardsForTheNextPlyToArrayOfCandidateBoards(board, white) {
    let stack = [];
    let numberOfPlies = 3;
    let arrayOfCandidateBoards = [];
    let nextMoveCandidateBoards = [];

    while (numberOfPlies > 0) {
      if (stack.length === 0) {
        nextMoveCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
          board,
          white
        ); // TODO: if stack !empty, take this from the stack
        arrayOfCandidateBoards.push(nextMoveCandidateBoards);
        stack.push(nextMoveCandidateBoards);
      }

      while (stack.length > 0 && numberOfPlies > 0) {
        nextMoveCandidateBoards = stack.pop();
        for (let i = 0; i < nextMoveCandidateBoards.length; ++i) {
          let candidateBoards = this.getNextMoveCandidateBoardsForABoard(
            nextMoveCandidateBoards[i],
            !white
          );
          if (numberOfPlies > 0) {
            stack.push(candidateBoards);
            numberOfPlies--;
          }
          // add candidateBoards to stack, then pop it from there for the next  nextMoveCandidateBoards for the next iteration
          arrayOfCandidateBoards.push(candidateBoards);
        }
      }
    }
    return arrayOfCandidateBoards;
  }

  // using ranges to map the absolute best board index to the root moves board index
  getNextMoveBoardIndexForAbsoluteBoardNumber(
    deepness,
    absoluteBoardNumber,
    scoreArrays,
    white
  ) {
    let nextMoveBoardIndexNumber = 0;

    const rootScoreArray = scoreArrays[scoreArrays.length - 1]; // this array contains all the possible scores for the next moves, order is the same as the allowedBoards order

    let rangeSumArrays = []; // ranges for each root board

    let previousDeepScoreArrayForCalculatingRanges = [];

    if (scoreArrays.length <= 2) {
      return Heuristics.getBestNextMoveBoardNumber(
        scoreArrays[1],
        absoluteBoardNumber,
        white
      );
    } else {
      previousDeepScoreArrayForCalculatingRanges = scoreArrays[deepness - 2]; // TODO for calculating ranges for the (next) leaf nodes  was: scoreArrays.length - gap
    }

    let rootScoreArrayPos = 0;
    rangeSumArrays = [scoreArrays.length];
    let sum = 0;

    let startPosition = 0;

    while (rootScoreArrayPos < rootScoreArray.length) {
      for (
        let i = startPosition;
        i <
        startPosition +
          Math.abs(
            rootScoreArray[rootScoreArray.length - 1 - rootScoreArrayPos]
          ); // rootScoreArray WAS originally from a stack - LIFO, we need to reverse the order here!
        ++i
      ) {
        sum += Math.abs(previousDeepScoreArrayForCalculatingRanges[i]); // must be positive integer!
      }
      rangeSumArrays[rootScoreArrayPos] = sum;
      startPosition +=
        rootScoreArray[rootScoreArray.length - 1 - rootScoreArrayPos];
      rootScoreArrayPos++;
      sum = 0;
    } // while

    if (deepness === 4) {
      // TODO: fix this magic number...
      // one more round
      //const checkedSum = Heuristics.getCheckSum(scoreArrays[2]);
      //const checkedSum2 =  Heuristics.getCheckSum(scoreArrays[1]);
      let start = 0;
      for (let r = 0; r < rangeSumArrays.length; r++) {
        let sumScore = 0;

        console.log("RANGE R = " + rangeSumArrays[r]);
        for (let s = start; s < start + rangeSumArrays[r]; s++) {
          sumScore += scoreArrays[1][s];
        }
        start += rangeSumArrays[r];
        rangeSumArrays[r] = Math.abs(sumScore);
      } // for
    } // if

    nextMoveBoardIndexNumber = Heuristics.getBestNextMoveBoardNumber(
      rangeSumArrays,
      absoluteBoardNumber
    );

    // TODO: calculate EVAL function score first based on DEEP=3, use scoreArrays & rangeSumArrays

    return nextMoveBoardIndexNumber;
  }

  /**
   * Does set state.
   * Board needs to be constructed before pieces are added.
   *
   */
  initBoard() {
    const squares = [65]; // the last square is just for landing a possible CHECK for this candidate board position!

    // fill board with squares
    for (let idx = 0, r = 0; r < CONSTANTS.squaresInRow; r++) {
      for (let c = 0; c < CONSTANTS.squaresInCol; c++) {
        let square = {
          index: idx,
          row: r, // rows: 0...7
          col: c, // col: 0...7
          piece: null,
        }; // each square has an index ranging from 0 to 63
        squares[idx] = square;
        idx++;
      }
    }
    this.setState({ currentBoard: squares }, function () {
      const { currentBoard, pieces } = this.state;

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
          currentBoard[item[0]].piece = piece;
        }
        pieces[piece.n] = piece;
      });
      this.setState({ pieces });
    });
  }

  /**
   * Does set state.
   * pieces will be added to the board after the board has been constructed
   * @returns board pieces
   */
  initPieces() {
    console.log("starting initpieces");
    const { currentBoard, pieces } = this.state;

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
        currentBoard[item[0]].piece = piece;
      }
      pieces[piece.n] = piece;
    });

    this.setState({ pieces });
    //this.makeNumberOfMoves(3); // check game over condition!
    return pieces;
  }

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

      if (piece === null || !piece.white) continue; // piece has been captured or not a white piece
      let candidateMoves = this.getCandidateMovesForPiece(piece, board);

      if (
        board[CONSTANTS.whiteKingId].piece !== null &&
        !this.state.whiteKingMoved // it's OK to have only one variable in state for 'whiteKingMoved', as it corresponds the real history i.e. squares (the chosen previous move)
      ) {
        if (
          !castlingLeftAddedAsCandidateMove &&
          !this.state.whiteLeftRookMoved
        ) {
          if (
            board[57].piece === null &&
            board[58].piece === null &&
            board[59].piece === null
            //&& board[56].piece.value === CONSTANTS.WHITE_ROOK_CODE
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
            board[60].piece !== null // king should be there!
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
    } // ..for
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
      if (piece.white) continue; // it was white!

      const candidateMoves = this.getCandidateMovesForPiece(piece, board);

      if (candidateMoves === undefined) {
        continue; // no available moves for this piece
      }

      if (
        board[CONSTANTS.blackKingId].piece !== null &&
        !this.state.blackKingMoved
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

  getTotalNumberOfCandidateBoards(arrayOfCandidateBoardsArrays) {
    let n = 0;
    for (let i = 0; i < arrayOfCandidateBoardsArrays.length; ++i) {
      let array = arrayOfCandidateBoardsArrays[i];
      n += array.length;
    }
    return n;
  }

  /**
   * @param {*} white
   * @param {*} board
   * @param {*} less
   */
  getArrayOfCandidateBoardsArrays(white, board, deepness) {
    let stack = [];
    let scoreArrays = []; // store individual candidateBoardArrays lengths for the eval score function

    deepness++; // convenience addition?!

    for (let i = 0; i < deepness - 1; ++i) {
      scoreArrays[i] = [];
    }

    let nextMoveCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
      board,
      white
    );
    console.log(
      "white = " + white + " boards = " + nextMoveCandidateBoards.length
    );

    //scoreArraysDeepness[deepness][nextMoveCandidateBoards.length]; // TODO: this should be for the complete deep X totalEvalScoreSumArray (e.b. score = W-B+W-B)

    for (let i = 0; i < nextMoveCandidateBoards.length; ++i) {
      stack.push(nextMoveCandidateBoards[i]);
    }

    let nextPlyColor = !white;
    let arrayOfCandidateBoardsArrays = [];

    while (stack.length > 0) {
      let childBoard = stack.pop();
      let nextMoveCandidateBoardsFirsts =
        this.getNextMoveCandidateBoardsForABoard(childBoard, !white); // TODO: add these boards to stack if deepness counter requires that
      arrayOfCandidateBoardsArrays.push(nextMoveCandidateBoardsFirsts);
    } // while

    while (deepness-- > 0) {
      console.log("DEEPNESS = " + deepness);
      const deepnessMinusOne = deepness - 1;
      //let minBlack = 100;
      //let maxWhite = 0;

      for (let i = 0; i < arrayOfCandidateBoardsArrays.length; ++i) {
        //nextMoveCandidateBoards = arrayOfCandidateBoardsArrays[i];

        /*  console.log(
          "FIRST next move candit boards length = " +
            nextMoveCandidateBoards.length
        );*/
        // console.log("candidate array length: = " + arrayOfCandidateBoardsArrays[i].length + " deepNess = " + deepness);

        scoreArrays[deepnessMinusOne].push(
          arrayOfCandidateBoardsArrays[i].length
        ); // nextMoveCandidateBoardsLengthScore

        if (deepness <= 1) continue;

        // 4 = black, 3 = white, 2 = black
        for (let j = 0; j < arrayOfCandidateBoardsArrays[i].length; ++j) {
          stack.push(arrayOfCandidateBoardsArrays[i][j]); // TODO: put only feasible candidates to the stack to avoid stack overflow
        }

        // TODO: the below code is not used in a meaningful way
        /*  if (deepness % 2 === 0) {
          if (arrayOfCandidateBoardsArrays[i].length <= minBlack) {
            minBlack = arrayOfCandidateBoardsArrays[i].length; // select a node that causes min next moves for the opponent 
            console.log("min opponent: " + minBlack + " deepness=" + deepness);
          } else continue;
        } else {
          if (arrayOfCandidateBoardsArrays[i].length >= maxWhite) {
            maxWhite = arrayOfCandidateBoardsArrays[i].length; // select a node that causes max next moves you
            console.log("max own: " + maxWhite + " deepness=" + deepness);
          } else continue;
        }*/
      } // for

      arrayOfCandidateBoardsArrays.length = 0; // clear the array

      if (deepness > 1) {
        console.log(" stack length = " + stack.length);
        let stackLength = 0;
        if (stack.length > 200000) {
          stackLength = stack.length;
        }
        while (stack.length > 0) {
          if (stack.length < stackLength - 30000) {
            stackLength = stack.length;
            console.log("stack length = " + stackLength);
          }
          arrayOfCandidateBoardsArrays.push(
            this.getNextMoveCandidateBoardsForABoard(stack.pop(), !nextPlyColor)
          ); // SCORE
        } // while stack
      } // IF deepness
      stack.length = 0;
      //deepness--;
    } // while deepness
    //const checkSum = Heuristics.getCheckSum(scoreArrays[0]);
    return arrayOfCandidateBoardsArrays;
    //ScoreSumProcessor.getScoreSumArray(scoreArrays); // TODO: we should possibly return a compound array consisting of scoreArrays AND arrayOfCandidateBoardsArrays
  }
  // TODO: continue from here 22.8.2023 to get maxScore(OwnNextMaxMoves-OpponentNextMaxMoves)
  // getCandidateboardIndexWithMinMaxNextMoves(candidateBoards, true) -  getCandidateboardIndexWithMinMaxNextMoves(candidateBoards, false)

  getCandidateboardIndexWithMinMaxNextMoves2(candidateBoards, white) {
    let maxNextMoves = 0;
    let selectedBoardIndexMax = 0;
    let selectedBoardIndexMin = 0;

    for (let i = 0; i < candidateBoards.length; ++i) {
      let nextMoveCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
        candidateBoards[i],
        white
      );
      if (nextMoveCandidateBoards.length > maxNextMoves) {
        maxNextMoves = nextMoveCandidateBoards.length;
        selectedBoardIndexMax = i;
      }
    }
    let minNextMoves = 100;

    for (let i = 0; i < candidateBoards.length; ++i) {
      let nextMoveCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
        candidateBoards[i],
        !white
      );
      if (nextMoveCandidateBoards.length < minNextMoves) {
        minNextMoves = nextMoveCandidateBoards.length;
        selectedBoardIndexMin = i;
      }
    }
    if (minNextMoves <= 1) return selectedBoardIndexMin;
    if (maxNextMoves > 8 * minNextMoves) {
      return selectedBoardIndexMax;
    } else return selectedBoardIndexMin;
  }

  // TODO 7/11/23
  // Instead of using DEEP and iterations, we need to use heuristical calculations and evaluation functions to find the optimal next move!
  // Target: 549 & Fool's mate moves

  getCandidateboardIndexWithMinMaxNextMoves(
    allowedMoves,
    candidateBoards,
    white
  ) {
    let topScore = -100;
    let selectedBoardIndexMax = 0;
    let allowedMovesPerCandidateBoard = [];
    let allowedOpponentMovesPerCandidateBoard = [];
    let scores = []; // use this to decide a smaller game three using alpha-beta pruning, e.g. TOP 3

    for (let i = 0; i < candidateBoards.length; ++i) {
      let nextMoveCandidateBoardsOpponent =
        this.getNextMoveCandidateBoardsForABoard(candidateBoards[i], !white);

      if (nextMoveCandidateBoardsOpponent === 0) return i; // it is check mate for the opponent, so return here

      let nextMoveCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
        candidateBoards[i],
        white
      );
      allowedOpponentMovesPerCandidateBoard[i] =
        nextMoveCandidateBoardsOpponent.length;
      allowedMovesPerCandidateBoard[i] = nextMoveCandidateBoards.length;

      let threatScore = ThreatScores.getTotalOpponentThreatScoreAgainstMe(
        candidateBoards[i],
        !white
      );

      let threatScore2 = ThreatScores.getTotalOpponentThreatScoreAgainstMe(
        candidateBoards[i],
        white
      );

      let moveDistanceScore = this.getMoveDistance(
        candidateBoards[i],
        allowedMoves[i]
      );

      let addition = 0;

      if (this.state.nextPly === 6) {
        addition = 0.3; // TODO: this needs to be removed or made proportional to this.state.nextPly
      }
      // TODO: improve with alpha-beta pruning (e.g. 3 best boards) and with Q-learning
      let minMaxTrivial =
        nextMoveCandidateBoards.length - nextMoveCandidateBoardsOpponent.lengt;
      let minMax =
        (3.1 + addition) * nextMoveCandidateBoards.length -
        nextMoveCandidateBoardsOpponent.length +
        Math.abs(0.8 * threatScore) -
        Math.abs(0.97 * threatScore2) -
        moveDistanceScore; // heuristic 1: prefer shorter distance, TODO: subtract againstWhiteThreatScore
      // TODO: add number of allowed (own King next moves - opponent King next moves) scores (Cursor AI)
      console.log(
        i +
          " | " +
          allowedMoves[i] +
          " | next moves: " +
          nextMoveCandidateBoards.length +
          " | next moves opponent:" +
          +nextMoveCandidateBoardsOpponent.length +
          " | threat score:" +
          threatScore +
          " | threat score2:" +
          threatScore2 +
          " minMax = " +
          minMax +
          " | distance score: " +
          moveDistanceScore
      );
      scores[i] = minMax;
      console.log("PARSEINT=" + parseInt(minMax, 10));
      if (parseInt(minMax, 10) > parseInt(topScore, 10)) {
        topScore = minMax;
        selectedBoardIndexMax = i;
      }
    } // ..for
    console.log(
      "SELECTED IDX:" +
        selectedBoardIndexMax +
        "|MINIMAX: " +
        topScore +
        "|MOVE:" +
        allowedMoves[selectedBoardIndexMax]
    );

    // call deep +2? here to get additional INFO ( can be eaten?), combination of this and DEEP
    return selectedBoardIndexMax;
  }

  getCandidateboardIndexWithMaxOwnNextMoves(candidateBoards, white) {
    let maxNextMoves = 0;
    let selectedBoardIndex = 0;
    for (let i = 0; i < candidateBoards.length; ++i) {
      let nextMoveCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
        candidateBoards[i],
        white
      );
      if (nextMoveCandidateBoards.length > maxNextMoves) {
        maxNextMoves = nextMoveCandidateBoards.length;
        selectedBoardIndex = i;
      }
    }
    return selectedBoardIndex;
  }

  // TODO: this could be combined / filtered with getCandidateboardIndexWithMaxOwnNextMoves
  getCandidateboardIndexWithMinOpponentNextMoves(candidateBoards, white) {
    let minNextMoves = 100;
    let selectedBoardIndex = 0;
    for (let i = 0; i < candidateBoards.length; ++i) {
      let nextMoveCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
        candidateBoards[i],
        !white
      );
      if (nextMoveCandidateBoards.length < minNextMoves) {
        minNextMoves = nextMoveCandidateBoards.length;
        selectedBoardIndex = i;
      }
    }
    return selectedBoardIndex;
  }

  /**
   *
   * @param {*} board
   * @param {*} white
   * @returns
   */
  getNextMoveCandidateBoardsForABoard(board, white) {
    //console.log("***getNextMoveCandidateBoardsForABoard****");
    const candidateMoves = white
      ? this.getCandidateMovesWhite(board)
      : this.getCandidateMovesBlack(board);

    return this.getCandidateBoards(
      this.getAllowedMoves(white, board, candidateMoves),
      board,
      white
    );
  }

  // TODO: further check if the opponent can e.g. win tempo by checking!
  // this needs to be called for all candidateboards, to be able to select the best board according to the score
  getNextDiffCandidateBoardsScoreForABoard(board, white) {
    let candidateMovesWhite = this.getCandidateMovesWhite(board);
    let candidateMovesBlack = this.getCandidateMovesBlack(board);
    let candidateBoardsWhite = this.getAllowedMoves(
      true,
      board,
      candidateMovesWhite
    );
    let candidateBoardsBlack = this.getAllowedMoves(
      false,
      board,
      candidateMovesBlack
    );

    let diff = 0;
    if (white) {
      diff = candidateBoardsWhite - candidateBoardsBlack;
      return candidateBoardsBlack === 0 ? CONSTANTS.WIN : diff;
    } else {
      diff = candidateBoardsBlack - candidateBoardsWhite;
      return candidateBoardsWhite === 0 ? CONSTANTS.WIN : diff; // return particular board score; the better score the better board -> should be possibly selected
    }
  }

  /**
   *
   * @param {*} allowedMoves
   * @param {*} white
   * @returns
   */
  getCandidateBoards(allowedMoves, board, white) {
    let candidateBoards = [];

    // board will be stored to boards array (state)
    //Lodash deep clone is required, as the array contains objects (i.e. pieces)
    //https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089

    for (let i = 0; i < allowedMoves.length; ++i) {
      // each allowed move corresponds one candidateBoard, that is, their indexes are synchronized
      candidateBoards[i] = this.getCandidateBoardCorrespondingAllowedMove(
        allowedMoves[i],
        _.cloneDeep(board),
        white
      ); // check that all kind of special moves are dealt as well (e.g. castling and its restrictiones)
    }
    //console.log("candidateBoards L = " + candidateBoards.length);
    return candidateBoards;
  }
  /**
   *
   * @param {*} white
   * @param {*} board
   * @returns
   */

  /*getCandidateMovesForBoard(white, board) {
    return white ? this.getCandidateMovesWhite(board) : this.getCandidateMovesBlack(board);
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
    let { pieces } = this.state;

    // handle promotions and underpromotions
    switch (delim) {
      case CONSTANTS.PROMOTION_TO_QUEEN: {
        let promotedQueenNumber = white
          ? this.state.promotedWhiteQueenNumber
          : this.state.promotedBlackQueenNumber;
        board = PromotionFunctions.doPromote(
          board,
          pieces,
          moves,
          promotedQueenNumber
        );
        break;
      }
      case CONSTANTS.PROMOTION_TO_ROOK: {
        let promotedRookNumber = white
          ? this.state.promotedWhiteRookNumber
          : this.state.promotedBlackRookNumber;
        board = PromotionFunctions.doPromote(
          board,
          pieces,
          moves,
          promotedRookNumber
        );
        break;
      }
      case CONSTANTS.PROMOTION_TO_BISHOP: {
        let promotedBishopNumber = white
          ? this.state.promotedWhiteBishopNumber
          : this.state.promotedBlackBishopNumber;
        board = PromotionFunctions.doPromote(
          board,
          pieces,
          moves,
          promotedBishopNumber
        );
        break;
      }
      case CONSTANTS.PROMOTION_TO_KNIGHT: {
        let promotedKnightNumber = white
          ? this.state.promotedWhiteKnightNumber
          : this.state.promotedBlackKnightNumber;
        board = PromotionFunctions.doPromote(
          board,
          pieces,
          moves,
          promotedKnightNumber
        );
        break;
      }
      case CONSTANTS.CASTLING_QUEEN_SIDE: {
        board = this.castleQueenSideAllowedBoard(white, board); // castle queen side was the allowed move, create the corresponding board
        break;
      }
      case CONSTANTS.CASTLING_KING_SIDE: {
        board = this.castleKingSideAllowedBoard(white, board);
        break;
      }
      case CONSTANTS.EN_PASSANT: {
        board = EnPassantFunctions.doEnPassantComplete(board, moves);
        break;
      }
      default: {
        // normal move, includes captures
        board[moves[1]].piece = board[moves[0]].piece; // the move: dst square's piece becomes src square's piece
        board[moves[1]].piece.currentSquare = parseInt(moves[1], 10);
        board[moves[0]].piece = null; // the original src piece has moved, so the square doesn't have its peace anymore
      }
    }
    return board;
  }

  // eof candidate moves -  move allowances start from here

  /**
   *
   * @param {*} white
   * @param {*} board
   * @returns
   */
  castleQueenSideAllowedBoard(white, board) {
    if (white) {
      return CastlingFunctions.castleQueenSideWhite(board);
    } else {
      return CastlingFunctions.castleQueenSideBlack(board);
    }
  }
  /**
   *
   * @param {*} white
   * @param {*} board
   * @returns
   */
  castleKingSideAllowedBoard(white, board) {
    if (white) {
      return CastlingFunctions.castleKingSideWhite(board);
    } else {
      return CastlingFunctions.castleKingSideBlack(board);
    }
  }

  /**
   *
   * @param {*} white
   * @param {*} board
   * @param {*} candidateMoves
   * @returns
   */
  getAllowedMoves(white, board, candidateMoves) {
    if (candidateMoves === null || candidateMoves.length === 0) return null;
    let allowedMoves = white
      ? this.getAllowedMovesWhite(board, candidateMoves)
      : this.getAllowedMovesBlack(board, candidateMoves);

    allowedMoves = CheckFunctions.getTransformToPlusDelimForCheckMoves(
      board,
      allowedMoves,
      white
    );
    /*if (this.state.LOGGING) {
      console.log(
        "allowedmoves | " +
          white +
          " || " +
          allowedMoves +
          " length = " +
          allowedMoves.length
      );
    } */

    return allowedMoves;
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
      candidateMoves = this.getCandidateMovesWhite(board); // add *CHECK* instead of eating the king!
      allowedMoves = this.getAllowedMovesWhite(board, candidateMoves, boardIdx);
    } else {
      candidateMoves = this.getCandidateMovesBlack(board);
      allowedMoves = this.getAllowedMovesBlack(board, candidateMoves, boardIdx);
    }
    return allowedMoves;
  }

  /**
   * Does set state if there is a check in the board.
   * From the possible moves return those moves which are actually allowed.
   * @param  {[type]} candidateMovesWhite [description]
   * @param  {[type]} kingPosition       [description]
   * @param  {[type]} board            [description]
   * @return {[type]}                    allowedMoves
   */
  getAllowedMovesWhite(board, candidateMovesWhite, boardIdx) {
    const { candidateBoards } = this.state;
    let allowedMoves = []; // contains only the candidate moves that were eventually verified to be allowed

    const whiteKingPosition = this.getKingPosition(board, true);
    //console.log("white king pos = " + whiteKingPosition);

    const CASTLING_WHITE_QUEEN_SIDE_NOT_ALLOWED_SQUARES = /.60|.59|.58|.57/g; // numbers of the not-allowed squares
    const CASTLING_WHITE_KING_SIDE_NOT_ALLOWED_SQUARES = /.60|.61|.62/g; // numbers of the not-allowed squares

    for (let i = 0; i < candidateMovesWhite.length; i++) {
      const whiteCandidateMove = candidateMovesWhite[i];
      let moves = HelpFunctions.getMovesString(candidateMovesWhite[i]);

      const delim = HelpFunctions.getDelim(candidateMovesWhite[i]);

      if (delim === CONSTANTS.CHECK) {
        // candidate move IS check (against black)
        moves = candidateMovesWhite[i].split(CONSTANTS.CHECK);
        board[64] = CONSTANTS.CHECK; // let's FLAG that this board has check!
        candidateBoards[boardIdx] = board;

        this.setState({ candidateBoards }); // we need to update the candidate boards, as there's now check in this board
        /*console.error(
          "CHECK revised as an possible allowed move, candit move = " +
            whiteCandidateMove
        );*/
      } else if (delim === CONSTANTS.CASTLING_QUEEN_SIDE) {
        //console.log("Checking allowance of white queen side castling...");
        let blackCandidateMoves = this.getCandidateMovesBlack(board);

        let allowLeftCastling = true;

        for (let i = 0; i < blackCandidateMoves.length; i++) {
          const canditMove = blackCandidateMoves[i];
          //console.log('castling check: black move match: ' + canditMove + ' re = ' + re);
          let match = canditMove.match(
            CASTLING_WHITE_QUEEN_SIDE_NOT_ALLOWED_SQUARES
          );

          if (match !== null) {
            /*console.log(
              "castling check: white left castling NOT allowed, candit =" +
              whiteCandidateMove +
              " match=" +
              match +
              " black matching move = " +
              canditMove
            );*/
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

        for (let i = 0; i < blackCandidateMoves.length; i++) {
          const canditMove = blackCandidateMoves[i];
          if (
            canditMove.match(CASTLING_WHITE_KING_SIDE_NOT_ALLOWED_SQUARES) !==
            null
          ) {
            allowKingSideCastling = false;
            /*console.log(
              "castling check: right castling NOT allowed, candit =" +
              whiteCandidateMove
            ); */
            break;
          }
        }
        if (allowKingSideCastling) {
          // console.log("castling check: king side castling allowed, move =" + whiteCandidateMove);
          allowedMoves.push(whiteCandidateMove);
        }
        continue;
      }

      const src = parseInt(moves[0], 10);
      const dst = parseInt(moves[1], 10);
      let whiteKingMoveCandidate = whiteKingPosition;

      if (src === whiteKingPosition) {
        // white king move candidate!
        whiteKingMoveCandidate = dst;
      }

      if (
        this.isWhiteMoveAllowed(
          board,
          whiteKingMoveCandidate,
          whiteCandidateMove
        )
      ) {
        allowedMoves.push(whiteCandidateMove);
      }
    } // ..for

    return allowedMoves;
  }

  /**
   * Does set state if there is check in the board.
   * @param {*} board
   * @param {*} candidateMovesBlack
   * @param {*} boardIdx
   * @returns
   */
  getAllowedMovesBlack(board, candidateMovesBlack, boardIdx) {
    let allowedMoves = []; // contains only the candidate moves that were eventually verified to be allowed
    const { candidateBoards } = this.state;

    const blackKingPosition = this.getKingPosition(board, false);
    const CASTLING_BLACK_QUEEN_SIDE_NOT_ALLOWED_SQUARES = /1|2|3|4/g; // numbers of the not-allowed squares
    const CASTLING_BLACK_KING_SIDE_NOT_ALLOWED_SQUARES = /4|5|6/g; // numbers of the not-allowed squares
    //console.log("black king pos = " + blackKingPosition);

    for (let i = 0; i < candidateMovesBlack.length; i++) {
      const blackCandidateMove = candidateMovesBlack[i];
      /*console.log(
        "candidate move black = " + i + " move = " + candidateMovesBlack[i]
      );*/
      const delim = HelpFunctions.getDelim(candidateMovesBlack[i]);
      let moves = HelpFunctions.getMovesString(blackCandidateMove);

      if (delim === CONSTANTS.CHECK) {
        moves = candidateMovesBlack[i].split(CONSTANTS.CHECK);
        board[64] = CONSTANTS.CHECK; // let's FLAG that this board has check!
        candidateBoards[boardIdx] = board;

        this.setState({ candidateBoards }); // we need to update the candidate boards, as there's now check in this board
        /*console.error(
          "CHECK revised as an possible allowed move, candit move = " +
            blackCandidateMove
        );*/
      } else if (blackCandidateMove.includes(CONSTANTS.CASTLING_QUEEN_SIDE)) {
        const whiteCandidateMoves = this.getCandidateMovesWhite(board);
        let allowLeftCastling = true;

        for (let i = 0; i < whiteCandidateMoves.length; i++) {
          const canditMove = whiteCandidateMoves[i].split(delim);
          const dst = canditMove[1];
          if (dst === undefined) continue; // P , ()
          if (dst.length !== 1) continue;
          const match = dst.match(
            CASTLING_BLACK_QUEEN_SIDE_NOT_ALLOWED_SQUARES
          );

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
        const whiteCandidateMoves = this.getCandidateMovesWhite(board);
        let allowRightCastling = true;

        for (let i = 0; i < whiteCandidateMoves.length; i++) {
          const canditMove = whiteCandidateMoves[i].split(delim);
          const dst = canditMove[1];
          if (dst === undefined) continue; // P or ()
          if (dst.length !== 1) continue;
          const match = dst.match(CASTLING_BLACK_KING_SIDE_NOT_ALLOWED_SQUARES);

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

      const src = parseInt(moves[0], 10);
      const dst = parseInt(moves[1], 10);
      let kingPosition = blackKingPosition;

      if (src === kingPosition) {
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
    const debug = false;
    const blackCapturedPosition = parseInt(whiteCandidateMove.slice(-2), 10);
    let allowed = true;

    for (let i = 0; i <= CONSTANTS.whiteRightRookId; i++) {
      let piece = board[i].piece;

      if (piece === null || (!piece.white && i === blackCapturedPosition)) {
        continue; // no piece here or black will be captured here
      }
      if (piece.white) continue; // only consider black pieces here!

      const value = piece.value;

      switch (value) {
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
            board,
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
          if (!allowed) {
            /*console.log(
              "Not allowed: " +
              whiteCandidateMove +
              "*isAllowedByOpponentBlackQueen*" +
              whiteCandidateMove
            );*/
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
    const whiteCapturedPosition = parseInt(blackCandidateMove.slice(-2), 10); // white will be captured here

    for (let i = 0; i < CONSTANTS.NUMBER_OF_SQUARES; i++) {
      const piece = board[i].piece;

      if (piece === null || (piece.white && i === whiteCapturedPosition)) {
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
            board,
            blackKingPosition
          );
          if (debug && !allowed) {
            console.log(
              "Not allowed: isAllowedByOpponentWhiteKnight" + blackCandidateMove
            );
          }
          break;
        case CONSTANTS.WHITE_BISHOP_CODE:
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
        case CONSTANTS.WHITE_ROOK_CODE:
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
        case CONSTANTS.WHITE_KING_CODE:
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
        case CONSTANTS.WHITE_QUEEN_CODE:
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

  /**
   *
   * @param {*} candidateMoves
   * @param {*} allowedMoves
   * @param {*} white
   * @returns
   */
  gameOver(candidateMoves, allowedMoves, white) {
    if (allowedMoves === null || allowedMoves.length === 0) {
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
      return true; // game over
    }
  }

  /**
   *
   * @param {*} candidateBoards
   * @param {*} white
   * @returns
   */
  getNumberOfAllowedNextMovesForBoard(candidateBoards, white) {
    let numberOfPossibleNextMoves = [];

    for (let i = 0; i < candidateBoards.length; ++i) {
      // each allowed move corresponds one candidateBoard, that is, their indexes are synchronized
      const allowedMovesForBoard = this.getAllowedMovesForBoard(
        candidateBoards[i],
        white,
        i
      );
      numberOfPossibleNextMoves[i] = allowedMovesForBoard.length;
    } // ..for
    return numberOfPossibleNextMoves;
  }

  /**
   *
   * @param {*} white
   * @param {*} candidateBoards
   * @param {*} allowedMoves
   * @param {*} numberOfPossibleNextMoves
   * @returns
   */
  getMaxMovesIndexWhileNotAllowingStalemate(
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
          candidateBoards[i]
        );

        if (numberOfAllowedOpponentMoves === 0) {
          return i; // this will be maxIdx, because it's an immediate mate!
        } else if (numberOfAllowedOpponentMoves < 2) {
          // TODO: at this point the opponent has only one possibly move which could mean an impending mate; this strategy should be refined
          return i;
        }
        // TODO: handle double consequtive moves mates, i.e. if the next move after this one is able to deliver a mate, select this move
        // the opponent may have multiple moves to avoid the mate
      }
      if (numberOfPossibleNextMoves[i] >= max) {
        numberOfPossibleNextMoves[i] += Heuristics.doublePawnPointsHandling(
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
      this.getNumberOfAllowedOpponentMoves(white, candidateBoards[maxIdx]) === 0
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

      maxIdx = this.getMaxMovesIndexWhileNotAllowingStalemate(
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
   * @param {*} white
   * @param {*} index
   * @param {*} candidateBoards
   * @returns
   */
  getNumberOfAllowedOpponentMoves(white, candidateBoard) {
    let allowedOpponentMoves = [];
    let candidateOpponentMoves = [];

    if (white) {
      candidateOpponentMoves = this.getCandidateMovesBlack(candidateBoard);
      //console.log("candit opponent moves = " + candidateOpponentMoves.length);
      // add heuristics to ADD or REDUCE points based on good/bad moves!
      // e.g. if opponent can capture queen with a rook -> reduce points
      allowedOpponentMoves = this.getAllowedMovesBlack(
        candidateBoard,
        candidateOpponentMoves
      );
    } else {
      candidateOpponentMoves = this.getCandidateMovesWhite(candidateBoard);
      allowedOpponentMoves = this.getAllowedMovesWhite(
        candidateBoard,
        candidateOpponentMoves
      );
    }
    return allowedOpponentMoves.length;
  }

  /**
   * This function is needed to get the king position when state update (pieces) hasn't happened.
   * @param {*} board
   * @param {*} white
   */
  getKingPosition(board, white) {
    for (let i = 0; i < CONSTANTS.NUMBER_OF_SQUARES; ++i) {
      if (board[i].piece === null) continue;

      if (board[i].piece === undefined) {
        console.log(" UNDEFINED, i = " + i);
      }
      if (white && board[i].piece.value === CONSTANTS.WHITE_KING_CODE) {
        return i;
      } else if (!white && board[i].piece.value === CONSTANTS.BLACK_KING_CODE) {
        return i;
      }
    }
  }

  /**
   * Does set state.
   * special moves: king, castling, promotion...
   *  castling won't be allowed if the king has moved already!
   * @param {*} srcSquare
   */
  setStatesOfCastlingMoves(srcSquare) {
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

  /**
   * Does set state.
   * @param {*} pieceNumberId
   * @param {*} pieces
   * @param {*} movesStringFromSelectedMove
   * @param {*} white
   */
  setStatesOfKingMovementAndPromotion(
    pieceNumberId,
    pieces,
    movesStringFromSelectedMove,
    white
  ) {
    if (
      pieceNumberId === CONSTANTS.whiteKingId ||
      pieceNumberId === CONSTANTS.blackKingId
    ) {
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
        promotedWhiteQueenNumber: this.state.promotedWhiteQueenNumber + 1,
      });
    } else if (
      !white &&
      pieceNumberId < 0 &&
      pieceNumberId <= CONSTANTS.BLACK_QUEEN_CODE
    ) {
      this.setState({
        promotedBlackQueenNumber: this.state.promotedBlackQueenNumber - 1,
      });
    } // TODO: add underpromotion piece number counters! (white & black)
  }

  render() {
    let board = this.state.currentBoard.map((square, index) => {
      return (
        <Square
          ref={index}
          key={index}
          index={index}
          chessId={square.chessId}
          piece={square.piece}
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
        <div className="nextply">
          <NextPly nextPly={this.nextPly} next={this.state.nextPly} />
        </div>
        <div className="prevply">
          <PrevPly prevPly={this.prevPly} next={this.state.nextPly} />
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
} // Chess class
export default Chess;
