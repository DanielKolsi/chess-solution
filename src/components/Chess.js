import React from "react";
import Square from "./Square";
import NextPly from "./NextPly";

import PrevPly from "./PrevPly";
import CONSTANTS from "../config/constants";

import * as Heuristics from "./Heuristics";
import * as MoveFunctions from "./MoveFunctions";
import * as ThreatScores from "./ThreatScores";
import * as CheckFunctions from "./CheckFunctions";
import * as HelpFunctions from "./HelpFunctions";
import * as CastlingFunctions from "./CastlingFunctions";
import * as PromotionFunctions from "./PromotionFunctions";
import * as EnPassantFunctions from "./EnPassantFunctions";
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
      arrayOfCandidateBoards: [],
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

    //this.moveMap = this.moveMap.bind(this);
    this.nextPly = this.nextPly.bind(this);
    this.prevPly = this.prevPly.bind(this);
  } // constructor

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
      if (stack.length == 0) {
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

  /**
   * Does set state.
   * @returns
   */
  nextPly() {
    let {
      currentBoardSquares: board,
      white,
      candidateBoards,
      pieces,
    } = this.state;
    const previousBoard = _.cloneDeep(board);
    this.state.previousBoards.push(previousBoard); // stack of previous boards, Lodash deep clone is required!

    const candidateMoves = this.getCandidateMovesForBoard(white, board);
    const allowedMoves = this.getAllowedMoves(white, board, candidateMoves);

    if (this.gameOver(candidateMoves, allowedMoves, white)) {
      return; // return as game over
    } // handle game over condition and ritual

    if (this.state.DEBUG) {
      console.log(
        " WHITE = " + white + " allowed moves:" + allowedMoves.join("|")
      );
    }
    /*
    let arrayOfCandidateBoards =
      this.addCandidateBoardsForTheNextPlyToArrayOfCandidateBoards(
        board,
        white
      );
*/
    /*let plies = 3; //4, (24,25,24,24),  97+4 = 101
    let boardsArray = this.getGameTreeBoardsArray(plies, board, white);
    console.log("boards array length = " + boardsArray.length);
*/

    //let array = this.getDeepXArray(board, true);
    let bestBoardNumberTrivial = this.getBoardNumberForBestMoveDeep4(board);
    let bestBoardNumber = this.getBoardNumberForBestMove(true, board, 4);
    return; // TODO: end code excution here for algorithm debugging purpose

    candidateBoards = this.getCandidateBoards(allowedMoves, board, white);
    const numberOfPossibleNextMoves = this.getNumberOfAllowedNextMovesForBoard(
      candidateBoards,
      white
    );

    const threatScoreForCandidateboards =
      ThreatScores.getThreatScoreForCandidateBoards(candidateBoards, white);
    const optimalThreatScoreBoardIndex =
      ThreatScores.getOptimalThreatScoreBoardIndex(
        threatScoreForCandidateboards,
        white
      );

    // TODO: check the purpose of this call as maxIdx is redefined afterwards
    const staleMateAvoidingMaxIdx =
      this.getMaxMovesIndexWhileNotAllowingStalemate(
        white,
        candidateBoards,
        allowedMoves,
        numberOfPossibleNextMoves
      );

    // this will be the final selected move for white / black determined by the heuristics / strategy
    const selectedMove = Heuristics.getSelectedMove(
      board,
      allowedMoves,
      optimalThreatScoreBoardIndex
    );

    const movesStringFromSelectedMove =
      HelpFunctions.getMovesString(selectedMove);

    const selectedMoveIndex = bestBoardNumber; // allowedMoves.indexOf(selectedMove); // TODO: this should correspond the board number
    let pieceNumberId;

    if (
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
    }

    this.setStatesOfKingMovementAndPromotion(
      pieceNumberId,
      pieces,
      movesStringFromSelectedMove,
      white
    );
    this.setStatesOfCastlingMoves(board[movesStringFromSelectedMove[0]]); // we need to check if the selected move caused restrictions that block future castling

    this.setState(
      {
        pieces,
        candidateBoards,
        currentBoardSquares: candidateBoards[selectedMoveIndex],
        white: !white,
        nextPly: ++this.state.nextPly,
      },
      function () {
        if (this.state.DEBUG) {
          console.log("state update complete, nextPly : " + this.state.nextPly);
        }
      }
    );
  } // nextPly

  /**
   * Does set state.
   */
  prevPly() {
    this.setState(
      {
        currentBoardSquares: this.state.previousBoards.pop(),
        white: !this.state.white,
        nextPly: --this.state.nextPly,
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
    this.setState({ currentBoardSquares: squares });
  }

  /**
   * Does set state.
   * pieces will be added to the board after the board has been constructed
   * @returns board pieces
   */
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
      this.nextPly(i + 1);
    }
  }
}*/

  // starting candidate moves functions

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
      if (!piece.white) continue; // it was a black piece...

      let candidateMoves = this.getCandidateMovesForPiece(piece, board);

      if (
        board[CONSTANTS.whiteKingId].piece !== null &&
        !this.state.whiteKingMoved // it's OK to have only one variable in state for 'whiteKingMoved', as it corresponds the real history i.e. squares (the chosen previous move)
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

  /**
   * Operations:
   *  array nextMoveCandidateBoards - getNextMoveCandidateBoards(board)
   *  put nextMoveCandidateBoard to stack
   * pop nextMoveCandidateBoard from stack while stack.length > 0   -> (for each board 1. )
   * while (stack.length > ) pop -> getNextMoveCandidateBoards(board) -> array of candidateBoardsArrays
   * write scores as leaf nodes to the subArray (score = leaf node nextMoveCandidateBoards.length vs. MinMax)
   * prepare & return first level subArray (x/4)
   * decrease deep counter
   * compare deep counter to 0
   * get track of whole score including all deepness levels using MinMax eval function
   * @param {*} white
   * @param {*} board
   * @param {*} deepness
   */
  getMainSubArray2(white, board, deepness) {
    let stack = [];
    let mainSubArray = []; // mainSubArray represents each branch of the main white "next moves" tree

    let nextMoveCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
      board,
      white
    );

    for (let i = 0; i < nextMoveCandidateBoards.length; ++i) {
      console.log("pushing to stack...");
      stack.push(nextMoveCandidateBoards[i]);
    }

    console.log(
      "nextMoveCandidateBoards length=" +
        nextMoveCandidateBoards.length +
        " stack length before popping = " +
        stack.length
    );
    let nextPlyColor = !white;
    let arrayOfCandidateBoardsArrays = [];
    let scoreArray = []; // store individual candidateBoardArrays lengths for the eval score function

    while (stack.length > 0) {
      let childBoard = stack.pop();
      let nextMoveCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
        childBoard,
        !white
      );
      arrayOfCandidateBoardsArrays.push(nextMoveCandidateBoards);
    } // while

    deepness--;
    console.log(
      "nextMoveCandidateBoards length=" +
        nextMoveCandidateBoards.length +
        " stack length after popping = " +
        stack.length
    );

    while (deepness > 0) {
      for (let i = 0; i < arrayOfCandidateBoardsArrays.length; ++i) {
        nextMoveCandidateBoards = arrayOfCandidateBoardsArrays[i];
        for (let j = 0; j < nextMoveCandidateBoards.length; ++j) {
          let board = nextMoveCandidateBoards[j];
          stack.push(board);
        }
      }
      console.log("FINAL stack length = " + stack.length);
      if (stack.length > 0 && deepness > 1) {
        arrayOfCandidateBoardsArrays = []; // clear the array
      }
       
      while (stack.length > 0) {
        let childBoard = stack.pop();
        let nextMoveCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
          childBoard,
          !nextPlyColor
        );
        if (deepness > 1) {
          // do at least one more round...
          arrayOfCandidateBoardsArrays.push(nextMoveCandidateBoards);
        }
      } // while stack
      deepness--;
    } // while deepness

    // process arrayOfCandidateBoardsArrays (which now only contains this subArray leaf nodes) to insert scores to the leaf nodes
    // e.g. mainSubArray.push(nextMoveCandidateBoards[x].length)
    for (let i = 0; i < arrayOfCandidateBoardsArrays.length; ++i) {
      mainSubArray[i] = arrayOfCandidateBoardsArrays[i].length; // TODO: or mainSubArray.push(arrayOfCandidateBoardsArrays[i].length);
    }
    return mainSubArray; // this could contain just leaf node scores
  }

  // get nextMoveCandidateBoards array based on boards in the stack | while (stack.length > 0) { getNextMoveCandidateBoard(stack.pop())}
  getMainSubArray(white, board, deepness) {
    let mainSubArray = []; // mainSubArray represents all possible (first level white) moves
    let stack = [];

    let mainBranchDeepness = deepness;
    let nextMoveCandidateBoards;
    /*let nextMoveCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
      board,
      white
    );*/ // first black, e.g. 25 possible boards/moves

    stack.push(board);
    //   mainBranchDeepness--;

    while (stack.length > 0) {
      board = stack.pop();
      nextMoveCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
        board,
        !white
      );
      console.log(
        "nnextMoveCandidateBoards length = " + nextMoveCandidateBoards.length
      );
      // just push to the stack the next round
      for (let i = 0; i < nextMoveCandidateBoards.length; ++i) {
        if (mainBranchDeepness === 0) {
          console.log("pushing here to mainsubArray");

          mainSubArray.push(nextMoveCandidateBoards);
        } else {
          let board = nextMoveCandidateBoards[i]; // e.g. 25 boards
          stack.push(board); // just a board to the stack, not an array of boards
        }
      } // for
      mainBranchDeepness--; // TODO: local deepness counter for each "subbranch" inside the board board[64] = deepness
      if (mainBranchDeepness === 0) break;
    } // while

    return mainSubArray;
  }

  /**
   *
   * @param {*} board starting board position
   * @param {*} deepness how many plies to cover? E.g. 1. white 2. black 3. white 4. black, ...
   */
  getBoardNumberForBestMove(white, board, deepness) {
    if (deepness < 1) return board;

    let arrayOfCandidateBoards = [];
    const candidateBoardsLevelOne = this.getNextMoveCandidateBoardsForABoard(
      board,
      white
    ); // OK

    deepness--;

    for (let n = 0; n < candidateBoardsLevelOne.length; ++n) {
      arrayOfCandidateBoards[n] = [];
    }
    ////////////////////
    for (let n = 0; n < candidateBoardsLevelOne.length; ++n) {
      arrayOfCandidateBoards[n] = this.getMainSubArray2(
        !white,
        candidateBoardsLevelOne[n],
        deepness
      );
      console.log(
        "|| n = " +
          n +
          " || arrayOfCandidateBoards[n].length = " +
          arrayOfCandidateBoards[n].length +
          " board = " +
          arrayOfCandidateBoards[n]
      );
    }
    console.log(
      "|| Array of candit boards = " +
        arrayOfCandidateBoards +
        " || Length = " +
        arrayOfCandidateBoards.length
    ); // this should contain all leaf node scores (eval function basis)

    /* for (let n = 0; n < candidateBoardsLevelOne.length; ++n) {
      let mainBranchDeepness = deepness;

      let nextMoveCandidateBoards = [];
      let stack = [];
      while (mainBranchDeepness >= 0 || stack.length > 0) {
        console.log("next move candidate boards");
        let prevMoveCandidateBoards = [];

        if (stack.length > 0) {
          prevMoveCandidateBoards = stack.pop(); // TODO, why do we need all this?!
        } else {
          prevMoveCandidateBoards = candidateBoardsLevelOne;
        }
        if (mainBranchDeepness > 0) {
          for (let i = 0; i < prevMoveCandidateBoards.length; ++i) {
            nextMoveCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
              prevMoveCandidateBoards[i],
              !white
            ); // TODO, fix this
            stack.push(nextMoveCandidateBoards);
          } // for
        } else if (mainBranchDeepness <= 0) {
          // only for leaf nodes
          console.log("n=" + n);
          for (let i = 0; i < prevMoveCandidateBoards.length; ++i) {
            arrayOfCandidateBoards[n].push(
              parseInt(prevMoveCandidateBoards.length, 10)
            );
          }
          // push only leaf nodes as scores; initially length function servers as a "mock score": W - B + W - B
        }
        mainBranchDeepness--;
      } // while

      console.log("main branch deepness = " + mainBranchDeepness);
    }*/

    let boardNumberForBestMove =
      Heuristics.getCandidateBoardNumberCorrespondingMaxScore(
        arrayOfCandidateBoards
      );
    return boardNumberForBestMove;
  }

  /**
   *
   * @param {*} board
   * @param {*} white
   * @returns
   */
  getDeepXArray(board, white) {
    let deep = 2;
    let stack = [];
    let arrayOfCandidateBoards = [];

    let firstLevelBoards = this.getNextMoveCandidateBoardsForABoard(
      board,
      white
    );
    stack.push(firstLevelBoards);

    /*for (let i = 0; i < firstLevelBoards.length; ++i) {
      arrayOfCandidateBoards[i] = []; // only for the first iteration
    }*/

    let next = [];
    while (stack.length > 0) {
      next = stack.pop();
      console.log("deep = " + deep + " stack.length = " + stack.length);
      //for (let n = 0; n < firstLevelBoards.length; ++n) {
      for (let i = 0; i < next.length; ++i) {
        if (deep === 1) {
          arrayOfCandidateBoards.push(parseInt(777, 10)); // push only leaf nodes as scores; initially length function servers as a "mock score": W - B + W - B
        } else {
          stack.push(this.getNextMoveCandidateBoardsForABoard(next[i], !white));
        }
      } // for
      //}
      deep--;
    } // while

    return arrayOfCandidateBoards; // return just the stack and process it later; i.e. process the scores from the stack to the arrayOfCandidateBoards (scoreboard)
  }
  getDeep2Array(board, white) {
    let deep = 3;
    let stack = [];
    let arrayOfCandidateBoards = [];
    let firstIterationDone = false;
    stack.push(this.getNextMoveCandidateBoardsForABoard(board, white));
    let prev = [];
    while (stack.length > 0) {
      if (deep > 1) {
        prev = stack.pop();
      }

      console.log("while....");
      for (let i = 0; i < prev.length; ++i) {
        if (!firstIterationDone) {
          arrayOfCandidateBoards[i] = []; // only for the first iteration
        }

        if (deep === 1) {
          const next = stack.pop();
          for (let j = 0; j < next.length; ++j) {
            // only score leaf nodes
            arrayOfCandidateBoards[i].push(parseInt(777, 10)); // push only leaf nodes as scores; initially length function servers as a "mock score": W - B + W - B
          }
        } else {
          stack.push(this.getNextMoveCandidateBoardsForABoard(prev[i], !white));
        }
      } // for
      firstIterationDone = true;
      deep--;
    } // while

    return arrayOfCandidateBoards;
  }
  /**
   * TODO: generalize this and make it this use stack & iterative (deep/ply as a parameter)
   */
  getBoardNumberForBestMoveDeep4(board) {
    // TODO: iterative implementation -> make this as a method to return the candidate boards
    // for a board and put them to an array of candit boards
    let arrayOfCandidateBoards = [];
    let firstPlyCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
      board,
      true
    ); // 4

    for (let i = 0; i < firstPlyCandidateBoards.length; ++i) {
      // 4
      let secondPlyCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
        firstPlyCandidateBoards[i],
        false
      ); // 24, 25, 24, 24

      arrayOfCandidateBoards[i] = []; // firstPly number of array -> choose the i (first ply number) from the array that has the highest score (get max array scores)
      //arrayOfCandidateBoards.push("I="+i); // this are all the first level moves (in this case only 4 possibilities!) -> give score for selecting the best I
      for (let j = 0; j < secondPlyCandidateBoards.length; ++j) {
        let thirdPlyCandidateBoards = this.getNextMoveCandidateBoardsForABoard(
          secondPlyCandidateBoards[j],
          true
        );
        for (let k = 0; k < thirdPlyCandidateBoards.length; ++k) {
          //this should take: 2 -> 24..49
          let fourthPlyCandidateBoards =
            this.getNextMoveCandidateBoardsForABoard(
              thirdPlyCandidateBoards[k],
              false
            );
          let score =            
          /*firstPlyCandidateBoards.length -
            secondPlyCandidateBoards.length +
            thirdPlyCandidateBoards.length -*/
            fourthPlyCandidateBoards.length; // evaluation function (heuristics)
          arrayOfCandidateBoards[i].push(parseInt(score, 10)); // push only leaf nodes as scores; initially length function servers as a "mock score": W - B + W - B
        }
      }
    } // for

    let boardNumberForBestMove =
      Heuristics.getCandidateBoardNumberCorrespondingMaxScore(
        arrayOfCandidateBoards
      );
    console.log("finished: best board number = " + boardNumberForBestMove);
    return boardNumberForBestMove;
  }
  /**
   *
   * @param {*} board
   * @param {*} white
   * @returns
   */
  getNextMoveCandidateBoardsForABoard(board, white) {
    const candidateMoves = this.getCandidateMovesForBoard(white, board);
    const allowedMoves = this.getAllowedMoves(white, board, candidateMoves);
    const candidateBoards = this.getCandidateBoards(allowedMoves, board, white);
    return candidateBoards;
  }

  /**
   * Recursive function only for proof-of-concept testing. JavaScript tree data structure.
   * @param {*} numberOfPlies
   * @param {*} board
   * @param {*} white
   * @returns
   */
  getGameTreeBoardsArray(numberOfPlies, board, white) {
    // return array of maps of candidateboards -> calculate score to them (score tree)
    console.log("numberOfPlies=" + numberOfPlies + " white = " + white);

    let { arrayOfCandidateBoards } = this.state;

    if (numberOfPlies === 1) {
      let candidateBoards = this.getNextMoveCandidateBoardsForABoard(
        board,
        white,
        numberOfPlies
      );
      //console.log("PUSHING FOR 1");
      //arrayOfCandidateBoards.push(candidateBoards);

      return candidateBoards;
    } else if (numberOfPlies > 1) {
      let candidateBoards = this.getNextMoveCandidateBoardsForABoard(
        board,
        white,
        numberOfPlies
      );

      for (let n = 0; n < candidateBoards.length; ++n) {
        let boards = this.getGameTreeBoardsArray(
          numberOfPlies - 1,
          candidateBoards[n],
          !white
        );
        /*console.log(
          "pushing boards n = " +
            n +
            " arrayOfCandidateBoards length BEFORE PUSH = " +
            arrayOfCandidateBoards.length
        );

        
        console.log(
          " arrayOfCandidateBoards length AFTER PUSH = " +
            arrayOfCandidateBoards.length
        );*/
        if (boards.length > 50) continue;
        arrayOfCandidateBoards.push(boards);
        if (boards.length > 25) {
          console.log("length exceeded = " + boards.length);
        }
      }
    }
    return arrayOfCandidateBoards;
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
  getCandidateMovesForBoard(white, board) {
    let candidateMoves = [];
    if (white) {
      candidateMoves = this.getCandidateMovesWhite(board);
    } else {
      candidateMoves = this.getCandidateMovesBlack(board);
    }
    //console.log("candit moves = " + candidateMoves);
    return candidateMoves;
  }
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

      board = PromotionFunctions.doPromote(board, moves, promotedQueenNumber);
    } else if (delim === CONSTANTS.PROMOTION_TO_ROOK) {
      let promotedRookNumber = white
        ? this.state.promotedWhiteRookNumber
        : this.state.promotedBlackRookNumber;

      board = PromotionFunctions.doPromote(board, moves, promotedRookNumber);
    } else if (delim === CONSTANTS.PROMOTION_TO_BISHOP) {
      let promotedBishopNumber = white
        ? this.state.promotedWhiteBishopNumber
        : this.state.promotedBlackBishopNumber;

      board = PromotionFunctions.doPromote(board, moves, promotedBishopNumber);
    } else if (delim === CONSTANTS.PROMOTION_TO_KNIGHT) {
      let promotedKnightNumber = white
        ? this.state.promotedWhiteKnightNumber
        : this.state.promotedBlackKnightNumber;

      board = PromotionFunctions.doPromote(board, moves, promotedKnightNumber);
    } else if (delim === CONSTANTS.CASTLING_QUEEN_SIDE) {
      board = this.castleQueenSideAllowedBoard(white, board); // castle queen side was the allowed move, create the corresponding board
    } else if (delim === CONSTANTS.CASTLING_KING_SIDE) {
      board = this.castleKingSideAllowedBoard(white, board);
    } else if (delim === CONSTANTS.EN_PASSANT) {
      board = EnPassantFunctions.doEnPassantComplete(board, moves);
    } else {
      // normal move, includes eats
      board[moves[1]].piece = board[moves[0]].piece; // the move: dst square's piece becomes src square's piece
      board[moves[1]].piece.currentSquare = parseInt(moves[1], 10);
      board[moves[0]].piece = null; // the original src piece has moved, so the square doesn't have its peace anymore
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
      console.log("WHITE queen side castling allowed...");
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

    let allowedMoves = [];

    if (white) {
      allowedMoves = this.getAllowedMovesWhite(board, candidateMoves);
    } else {
      allowedMoves = this.getAllowedMovesBlack(board, candidateMoves);
    }
    allowedMoves = CheckFunctions.getTransformToPlusDelimForCheckMoves(
      board,
      allowedMoves,
      white
    );
    if (this.state.LOGGING) {
      console.log(
        "allowedmoves | " +
          white +
          " || " +
          allowedMoves +
          " length = " +
          allowedMoves.length
      );
    }

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
      candidateMoves = this.getCandidateMovesWhite(board); // add *CHECK* instaed of eating the king!
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
        console.error(
          "CHECK revised as an possible allowed move, candit move = " +
            whiteCandidateMove
        );
      } else if (delim === CONSTANTS.CASTLING_QUEEN_SIDE) {
        console.log("Checking allowance of white queen side castling...");
        let blackCandidateMoves = this.getCandidateMovesBlack(board);

        let allowLeftCastling = true;

        for (let i = 0; i < blackCandidateMoves.length; i++) {
          const canditMove = blackCandidateMoves[i];
          //console.log('castling check: black move match: ' + canditMove + ' re = ' + re);
          let match = canditMove.match(
            CASTLING_WHITE_QUEEN_SIDE_NOT_ALLOWED_SQUARES
          );

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

        for (let i = 0; i < blackCandidateMoves.length; i++) {
          const canditMove = blackCandidateMoves[i];
          if (
            canditMove.match(CASTLING_WHITE_KING_SIDE_NOT_ALLOWED_SQUARES) !==
            null
          ) {
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

      const src = parseInt(moves[0], 10);
      const dst = parseInt(moves[1], 10);
      let whiteKingMoveCandidate = whiteKingPosition;

      // eslint-disable-next-line
      if (src == whiteKingPosition) {
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
        console.error(
          "CHECK revised as an possible allowed move, candit move = " +
            blackCandidateMove
        );
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

    for (let i = 0; i < CONSTANTS.NUMBER_OF_SQUARES; i++) {
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
      this.getNumberOfAllowedOpponentMoves(
        white,
        candidateBoards[maxIdx]
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
    for (let i = 0; i < board.length; ++i) {
      if (board[i].piece === null) continue;

      if (white && board[i].piece.value === CONSTANTS.WHITE_KING_CODE) {
        return i;
      } else if (!white && board[i].piece.value === CONSTANTS.BLACK_KING_CODE) {
        return i;
      }
    }
  }

  // functions that set state

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
