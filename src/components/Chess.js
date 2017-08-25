import React from 'react';
import Square from './Square';
import AutoMove from './AutoMove';
import PrevMove from './PrevMove';
import update from 'immutability-helper';
import CONSTANTS from '../config/constants';
import Moves from './Moves';
// import white promotions

//import PropTypes from 'prop-types'; // ES6

class Chess extends Moves {
  constructor(props) {
    super(props);
    this.state = {
      pieces: {},
      squares: [],
      promotedWhiteQueenNumber: 64,
      promotedBlackQueenNumber: -1,
      //      ids: [], // raw ref number of the piece, won't change
      white: true,
      moves: [],
      nextMove: 1,
      candidateMoves: [],
      previousMove: null,
      whiteKingMoved: false, // castling initial condition: rooks and king shall not be moved
      whiteLeftRookMoved: false,
      whiteRightRookMoved: false,
      blackKingMoved: false,
      blackLeftRookMoved: false,
      blackRightRookMoved: false
    }
    this.moveMap = this.moveMap.bind(this); //FIXME
    this.removePiece = this.removePiece.bind(this);
    this.autoMove = this.autoMove.bind(this);
    this.prevMove = this.prevMove.bind(this);
  }

  componentWillMount() {
    this.initBoard();
  }

  componentDidMount() {
    this.initPieces();
  }

  removePiece(pieceId, index) {
    delete this.state.pieces[pieceId];
    delete this.state.squares[index].piece;
    this.setState({pieces: this.state.pieces});
    this.setState({squares: this.state.squares});
  }

  moveMap(sr, sc, dr, dc) {
    const src = 56 - (((sr - 1) * 8)) + (sc - 1);
    const dst = 56 - (((dr - 1) * 8)) + (dc - 1);
    this.move(src, dst);
  }

  getCandidateMoves(piece, squares) {

    //console.log('piece type = ' + piece.type);
    const location = 1 * piece.location;

    let candidateMoves = [];

    if (squares[piece.location] === null) {
      return candidateMoves;
    }

    if (location !== undefined && this.refs[location] !== undefined && this.refs[location].refs.piece !== undefined) {
      //console.log('prev-move=' + this.state.previousMove);
      candidateMoves = this.refs[location].refs.piece.getCandidateMoves(piece, squares, this.state.previousMove);
    }
    /*if (candidateMoves !== undefined) {
      if (candidateMoves.length > 0) {
          console.log('accepted moves size = ' + candidateMoves.length + ' piece = ' + piece.type + ' location =' + piece.location);
      }
    }*/
    return candidateMoves
  }

  move(src, dst, special) {

    console.log('ACTUAL move: src =' + src + ' dst=' + dst + ' special = ' + special);
    const {squares, pieces} = this.state;
    //console.log('src='+src + ' dst =' + dst + ' special='+special);
    const square = squares[src];
    let piece = square.piece;

    if (piece === null) {
      console.log('piece was null src=' + src + 'dst=' + dst);
      return;
    }
    const pos = 1 * piece.location;

    if (piece.value === CONSTANTS.whitePawnValue && squares[dst].row === CONSTANTS.minRow) {

      let value = this.state.promotedWhiteQueenNumber;
      pieces[piece.n] = pieces[value]; // replace pawn with the promoted piece
      piece = pieces[value]; // actual promotion
      console.log('promonumber_white=' + value);
      piece.location = dst;
      this.setState({
        promotedWhiteQueenNumber: value++
      });
      this.setState({pieces: pieces});
    } else if (piece.value === CONSTANTS.blackPawnValue && squares[dst].row === CONSTANTS.maxRow) {
      let value = this.state.promotedBlackQueenNumber;
      console.log('promonumber_black=' + value);
      pieces[piece.n] = pieces[value]; // insert promoted piece to pieces
      piece = pieces[value]; // actual promotion
      piece.location = dst;
      this.setState({
        promotedBlackQueenNumber: value--
      });
      this.setState({pieces: pieces});
    }

    let mover = piece;
    let source = squares[pos];

    source.piece = null;
    let destination = squares[dst];

    if (destination !== undefined && destination.piece) {
      console.log('deleting: ' + destination.piece.type + ' id = ' + destination.piece.id + ' n=' + destination.piece.n);
      //pieces[destination.piece.id] = null; //FIXME, is required?

      if (special === 'P') { // en passe
        let id = null;
        let pieceToBeRemovedLocation = null;

        if (dst === (src + CONSTANTS.downLeft)) {
          pieceToBeRemovedLocation = src + CONSTANTS.left;
          id = squares[pieceToBeRemovedLocation].piece.n;
        } else if (dst === (src + CONSTANTS.downRight)) {
          pieceToBeRemovedLocation = src + CONSTANTS.right;
          id = squares[pieceToBeRemovedLocation].piece.n;
        } else if (dst === (src + CONSTANTS.upLeft)) {
          pieceToBeRemovedLocation = src + CONSTANTS.upLeft;
          id = squares[src + CONSTANTS.left].piece.n;
        } else if (dst === (src + CONSTANTS.upRight)) {
          pieceToBeRemovedLocation = src + CONSTANTS.upRight;
          id = squares[src + CONSTANTS.right].piece.n;
        }
        delete pieces[id];
        delete this.state.squares[pieceToBeRemovedLocation].piece;

      } else {
        delete pieces[destination.piece.n];
      }
      //delete this.state.squares[dst].piece;
      this.setState({pieces: pieces});
    }

    destination.piece = mover;
    destination.piece.location = dst;

    this.setState({
      squares: update(squares, {
        [src]: {
          $set: source
        }
      })
    });
    this.setState({
      squares: update(squares, {
        [dst]: {
          $set: destination
        }
      })
    });

    this.state.moves.push(src + '#' + dst);
    //console.log('moves = ' + this.state.moves.length);
    this.setState({pieces: pieces});
  }

  initBoard() {
    const squares = [];

    // fill board with squares
    for (let idx = 0, i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {

        let square = {
          index: idx,
          row: i, // rows: 0...7
          col: j, // col: 0...7
          piece: null
        } // each square has an index ranging from 0 to 63
        squares[idx] = square;
        idx++;
      }
    }
    this.setState({squares: squares});
  }

  initPieces() {
    const {squares, pieces} = this.state;

    this.props.setup.forEach((item) => {
      //console.log('item='+item);
      let piece = {
        location: item[0], // number 0..63, changes
        type: item[1], // actual piece, e.g. RookBA
        id: item[2], // piece id, e.g. bra
        n: item[3], // ORIGINAL number 0..63, won't change (unique identifier)
        white: item[4], // true if white
        value: item[5]
        //value: //exact piece value in relation to other pieces
      }

      if (item[0] >= 0 && (item[0] <= CONSTANTS.maxWhite)) {
        squares[item[0]].piece = piece;
      }

      pieces[piece.n] = piece;
    });

    this.setState({pieces: pieces});
    this.setState({squares: squares});
    //this.setState({ids: ids});
  }

  prevMove() {
    console.log('Prev move was: ' + this.state.previousMove);
  }

  getCandidateMovesWhite(squares, pieces) {

    let candidateMovesWhite = [];

    let castlingLeftAdded = false;
    let castlingRightAdded = false;


    for (let i = CONSTANTS.minWhite; i <= CONSTANTS.maxWhite; i++) {
      let piece = pieces[i];


      if (piece === null || piece === undefined || piece.white === false) {
        continue; // piece has been e.g. eaten
      }

      //console.log('\n WHITE: piece for moving =' + piece.type + ' white = ' + piece.white + ' value =' + piece.value + ' n=' + piece.n + ' location=' + piece.location);
      //console.log('piece = ' + piece.type + piece.location + piece.n);
      let candidateMoves = this.getCandidateMoves(piece, squares);
      if (candidateMoves === undefined) {
        console.log('No available moves for this piece.');
        continue;
      }

      if (squares[CONSTANTS.whiteKingId].piece !== null && this.state.whiteKingMoved === false) {

        if (!castlingLeftAdded && !this.state.whiteLeftRookMoved) {
          if (squares[57].piece === null && squares[58].piece === null && squares[59].piece === null) {
            candidateMoves.push(CONSTANTS.whiteKingId + '(' + 58); //add white castling (white king move!) left as a candidate move
            castlingLeftAdded = true;
          }
        }
        if (!castlingRightAdded && !this.state.whiteRightRookMoved) {
          if (squares[61].piece === null && squares[62].piece === null) {
            candidateMoves.push(CONSTANTS.whiteKingId + ')' + 62); //add white castling right (king move!) as a candidate move
            castlingRightAdded = true;
          }
        }
      }

      if (candidateMoves.length > 0 && candidateMovesWhite.length === undefined) {
        candidateMovesWhite = candidateMoves;
      } else if (candidateMoves.length > 0) {
        //console.log('adding candidateMoves, i = ' + i + ' n = ' + candidateMoves.length + ' p m w length = ' + candidateMovesWhite.length);
        if (!candidateMovesWhite.includes(candidateMoves)) {
          candidateMovesWhite = candidateMovesWhite.concat(candidateMoves); // candidateMoves, removalmoves, candidateMoves
        }
      }
    }
    return candidateMovesWhite;
  }

  /*
    This function is both for checking candidate moves for white / black AND for
    using as a "rejector" for the candidate move when opponentKing and opponentCandidateMove are specified.
  */
  getCandidateMovesBlack(squares, pieces) {

    let candidateMovesBlack = [];
    let castlingLeftAdded = false;
    let castlingRightAdded = false;

    for (let i = 0; i <= CONSTANTS.maxBlack; i++) {
      let piece = pieces[i];

      if (piece === null || piece === undefined || piece.white === true) {
        continue; // piece has been e.g. eaten
      }

      let candidateMoves = this.getCandidateMoves(piece, squares);

      if (candidateMoves === undefined) {
        console.log('No available moves for this piece.');
        continue;
      }

      if (squares[CONSTANTS.blackKingId].piece !== null && this.state.blackKingMoved === false) {

        if (!castlingLeftAdded && !this.state.blackLeftRookMoved) {
          if (squares[1].piece === null && squares[2].piece === null && squares[3].piece === null) {
            candidateMoves.push(CONSTANTS.blackKingId + '[' + 2); //add black castling (king move!) left as a candidate move
            castlingLeftAdded = true;
          }
        }
        if (!castlingRightAdded && !this.state.blackRightRookMoved) {
          if (squares[5].piece === null && squares[6].piece === null) {
            candidateMoves.push(CONSTANTS.blackKingId + ']' + 6); //add black castling right (king move!) as a candidate move
            castlingRightAdded = true;
          }
        }
      }

      if (candidateMoves.length > 0 && candidateMovesBlack.length === undefined) { //FIXME,candidateMovesBlack was null
        candidateMovesBlack = candidateMoves;
      } else if (candidateMoves.length > 0) {
        if (!candidateMovesBlack.includes(candidateMoves)) {
          candidateMovesBlack = candidateMovesBlack.concat(candidateMoves); // candidateMoves, removalmoves, candidateMoves
        }
      }
    }
    return candidateMovesBlack;
  }

  /**
   * From the possible moves return those moves which are actually allowed.
   * @param  {[type]} candidateMovesWhite [description]
   * @param  {[type]} kingPosition       [description]
   * @param  {[type]} squares            [description]
   * @param  {[type]} pieces             [description]
   * @return {[type]}                    allowedMoves
   */
  getAllowedMovesWhite(squares, pieces, whiteKingPosition, candidateMovesWhite) {

    let allowedMoves = []; // contains only the candidate moves that were eventually verified to be allowed

    //console.log('white_king_pos=' + whiteKingPosition);

    for (let i = 0; i < candidateMovesWhite.length; i++) {
      const str = candidateMovesWhite[i];
      let move = null;

      if (str.includes('#')) {
        move = candidateMovesWhite[i].split('#');
      } else if (str.includes('P')) { // en passe
        move = candidateMovesWhite[i].split('P');
      } else if (str.includes('(')) {

        let blackCandidateMoves = this.getCandidateMovesBlack(squares, pieces);

        let allowLeftCastling = true;
        const re = /.60|.59|.58|.57/g;// numbers of the not-allowed squares

        for (let i = 0; i < blackCandidateMoves.length; i++) {
            const canditMove = blackCandidateMoves[i];
            //console.log('castling check: black move match: ' + canditMove + ' re = ' + re);
            let match = canditMove.match(re);

            if (match !== null) {
              console.log('castling check: white left castling NOT allowed, candit ='+ str + ' match='+match + ' black matching move = ' + canditMove);
              allowLeftCastling = false;
              break;
            }
        }
        if (allowLeftCastling) {
            allowedMoves.push(str);
            console.log('castling check: left castling allowed, str ='+str);
        }
        continue; // no further allowance checks required!
      } else if (str.includes(')')) {

        let blackCandidateMoves = this.getCandidateMovesBlack(squares, pieces);
        let allowRightCastling = true;
        const re = /.60|.61|.62/g;// numbers of the not-allowed squares

        for (let i = 0; i < blackCandidateMoves.length; i++) {
            const canditMove = blackCandidateMoves[i];
            if (canditMove.match(re) !== null) {
              allowRightCastling = false;
              console.log('castling check: right castling NOT allowed, candit =' + str);
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
      let kingPosition = 1 * whiteKingPosition;

      if (src === kingPosition) { // white king move candidate!
        kingPosition = dst;
      }
      if (this.isWhiteMoveAllowed(squares, pieces, kingPosition, str)) {
        allowedMoves.push(str);
      }
    }
    return allowedMoves;
  }

  getAllowedMovesBlack(squares, pieces, blackKingPosition, candidateMovesBlack) {

    let allowedMoves = []; // contains only the candidate moves that were eventually verified to be allowed

    for (let i = 0; i < candidateMovesBlack.length; i++) {
      const str = candidateMovesBlack[i];

      let move = null;

      if (str.includes('#')) {
        move = candidateMovesBlack[i].split('#'); // [1] === dst move
      } else if (str.includes('P')) {
        move = candidateMovesBlack[i].split('P');
      } else if (str.includes('[')) {
        let whiteCandidateMoves = this.getCandidateMovesWhite(squares, pieces);
        let allowLeftCastling = true;
        const re = /1|2|3|4/g; // numbers of the not-allowed squares

        for (let i = 0; i < whiteCandidateMoves.length; i++) {
          const canditMove = whiteCandidateMoves[i].split('#');
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
      } else if (str.includes(']')) {
        let whiteCandidateMoves = this.getCandidateMovesWhite(squares, pieces);
        let allowRightCastling = true;
        const re = /4|5|6/g;// numbers of the not-allowed squares

        for (let i = 0; i < whiteCandidateMoves.length; i++) {
             const canditMove = whiteCandidateMoves[i].split('#');
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

      if (src === kingPosition) { // black king move candidate!
          kingPosition = dst;
      }

      if (this.isBlackMoveAllowed(squares, pieces, kingPosition, str)) {
        allowedMoves.push(str);
      }
    }
    return allowedMoves;
  }

  // to check whether a white move is allowed, you need to check opponent's next possible moves
  // if any black move collides with the white king, the white candidate move is rejected immediately
  isWhiteMoveAllowed(squares, pieces, whiteKingPosition, whiteCandidateMove) {
    let allowed = true;

    const whiteKing = pieces[CONSTANTS.whiteKingId];
    const whiteKingLocation = whiteKing.location;
    const whiteKingRow = squares[whiteKingLocation].row;
    const whiteKingCol = squares[whiteKingLocation].col;

    for (let i = 0; i <= CONSTANTS.maxBlack; i++) {
      let piece = pieces[i];

      if (piece === null || piece === undefined) {
        continue; // piece has been e.g. eaten
      }

      if (whiteCandidateMove !== undefined) {
        const pos = 1 * piece.location;
        const move = whiteCandidateMove.split('#'); // [1] === dst move

        const canditDst = 1 * move[1];
        if (canditDst === pos) {
          return allowed; // this white piece has been eaten (for this candidate move)!
        }
      }


      let value = piece.value;
      //console.log('black_value=' + value);
      switch (value) {
        case - 1:
          allowed = this.isAllowedByBlackPawn(piece, whiteKingPosition);
          break;
        case - 3:
          allowed = this.isAllowebByKnight(piece, whiteKingPosition);
          break;
        case - 4:
          allowed = this.isAllowedByBishop(piece, squares, whiteKingPosition, whiteCandidateMove);
          break;
        case - 5:
          allowed = this.isAllowedByRook(piece, squares, whiteKingPosition, whiteCandidateMove);
          break;
        case - 6:
          allowed = this.isAllowedByKing(piece, whiteKingPosition); //FIXME, is castling allowed?
          //console.log('allowedByKing=' + allowed + ' whitewhiteKingPosition=' + whiteKingPosition);
          break;
        case - 9:
          allowed = this.isAllowedByQueen(piece, squares, whiteKingPosition, whiteCandidateMove, whiteKingRow, whiteKingCol);
          break;
        default:
          break;
      }
      if (!allowed) {
        return false;
      }
    }
    return allowed;
  }

  // to check whether a white move is allowed, you need to check opponent's next possible moves
  // if any black move collides with the white king, the white candidate move is rejected immediately
  isBlackMoveAllowed(squares, pieces, blackKingPosition, blackCandidateMove) {

    console.log('checking if black: ' + blackCandidateMove + ' is allowed, black king pos = ' + blackKingPosition);

    let allowed = true;

    const blackKing = pieces[CONSTANTS.blackKingId];
    const blackKingLocation = blackKing.location;
    const blackKingRow = squares[blackKingLocation].row;
    const blackKingCol = squares[blackKingLocation].col;


    for (let i = CONSTANTS.minWhite; i <= CONSTANTS.maxWhite; i++) {
      let piece = pieces[i];


      if (piece === null || piece === undefined) {
        continue; // piece has been e.g. eaten
      }

      //let value = Math.abs(piece.value);
      let value = piece.value;

      if (blackCandidateMove !== undefined) {
        const pos = 1 * piece.location;
        const move = blackCandidateMove.split('#'); // [1] === dst move

        const canditDst = 1 * move[1];
        if (canditDst === pos) {
          return allowed; // this white piece has been eaten (for this candidate move)!
        }
      }

      switch (value) {

        case 1:
          allowed = this.isAllowedByWhitePawn(piece, blackKingPosition);
          break;
        case 3:
          allowed = this.isAllowebByKnight(piece, blackKingPosition);
          break;
        case 4:
          allowed = this.isAllowedByBishop(piece, squares, blackKingPosition, blackCandidateMove);
          break;
        case 5:
          console.log('is allowed by white rook, piece = ' + piece.value);
          allowed = this.isAllowedByRook(piece, squares, blackKingPosition, blackCandidateMove);

          break;
        case 6:
          allowed = this.isAllowedByKing(piece, blackKingPosition);
          //console.log('allowedByKing=' + allowed + ' blackKingDst=' + blackKingPosition);
          break;
        case 9:
          allowed = this.isAllowedByQueen(piece, squares, blackKingPosition, blackCandidateMove, blackKingRow, blackKingCol);
          break;
        default:
          break;
      }
      if (!allowed) {
        return false;
      }
    }
    return allowed;
  }

  autoMove(nextMove) {

    this.setState({nextMove: nextMove});
    let {pieces, squares, white} = this.state;

    if (white === true) {

      let candidateMovesWhite = this.getCandidateMovesWhite(squares, pieces);

      console.log('candidate white moves =' + candidateMovesWhite);
      let allowedMovesWhite = this.getAllowedMovesWhite(squares, pieces, pieces[CONSTANTS.whiteKingId].location, candidateMovesWhite);
      console.log('allowed white moves =' + allowedMovesWhite);

      if (allowedMovesWhite !== null && allowedMovesWhite.length > 0) { // FIXME, no moves available?
        const n = Math.floor(Math.random() * allowedMovesWhite.length);
        const str = allowedMovesWhite[n];

        console.log('selected move added as previous:' + str);
        this.setState({previousMove: str});

        if (str.includes('P')) {
          const whiteMoves = str.split('P');
          console.log('whitemoves-P=' + str);
          this.move(whiteMoves[0], whiteMoves[1], 'P');
        } else if (str.includes('(')) { // white left castling
          const whiteMoves = str.split('(');
          this.move(whiteMoves[0], whiteMoves[1]); // white king move left castling
          this.move(56, 59); // white rook move left castling
          this.setState({whiteKingMoved: true});
        } else if (str.includes(')')) {
          const whiteMoves = str.split(')');
          this.move(whiteMoves[0], whiteMoves[1]); // white king move (right castling)
          this.move(63, 61); // white rook move right castling
          this.setState({whiteKingMoved: true});
        } else {
          const whiteMoves = str.split('#');
          const src = 1 * whiteMoves[0];
          if (src === CONSTANTS.whiteKingId) {
            this.setState({whiteKingMoved: true});
            console.log('setting white king MOVED');
          } else if (src === 56) {
            this.setState({whiteLeftRookMoved: true});
          } else if (src === 63) {
            this.setState({whiteRightRookMoved: true});
          }
          this.move(whiteMoves[0], whiteMoves[1]);
        }

        this.setState({white: false});
      } else {
        console.log('CHECK MATE, BLACK wins or stalemate.'); // FIXME, add stalemate handling
      }
    } else { //black move
      let candidateMovesBlack = this.getCandidateMovesBlack(squares, pieces);
      console.log('candidate black moves =' + candidateMovesBlack);
      let allowedMovesBlack = this.getAllowedMovesBlack(squares, pieces, pieces[CONSTANTS.blackKingId].location, candidateMovesBlack);
      console.log('allowed black moves =' + allowedMovesBlack);

      if (allowedMovesBlack !== null && allowedMovesBlack.length > 0) { // FIXME, no moves available?
        const n = Math.floor(Math.random() * allowedMovesBlack.length);
        const str = allowedMovesBlack[n];
        console.log('previousMove:' + str);
        this.setState({previousMove: str});

        if (str.includes('P')) { // en passe
          const blackMoves = str.split('P');
          this.move(blackMoves[0], blackMoves[1], 'P');
        } else if (str.includes('[')) { //black castling
          const blackMoves = str.split('[');
          this.move(blackMoves[0], blackMoves[1]); // king move
          this.move(0, 3); // rook move
          this.setState({blackKingMoved: true});
        } else if (str.includes(']')) {
          const blackMoves = str.split(']');
          this.move(blackMoves[0], blackMoves[1]); // king move
          this.move(7, 5); // rook move
          this.setState({blackKingMoved: true});
        } else {
          const blackMoves = allowedMovesBlack[n].split('#');
          const src = 1 * blackMoves[0];

          if (src === CONSTANTS.blackKingId) {
            this.setState({blackKingMoved: true});
          } else if (src === 0) {
            this.setState({blackLeftRookMoved: true});
          } else if (src === 7) {
            this.setState({blackRightRookMoved: true});
          }
          this.move(blackMoves[0], blackMoves[1]);
        }
        //console.log('BLACK MOVED * total moves were = ' + allowedMovesBlack.length + ' selected random = ' + allowedMovesBlack[n] + ' n was = ' + n);
        this.setState({white: true});
      } else {
        console.log('CHECK MATE, WHITE wins or stalemate.');
      }
    }
  }

  render() {
    let squares = this.state.squares.map((square, index) => {

      return (<Square ref={index} key={index} index={index} chessId={square.chessId} piece={square.piece} moveMap={this.moveMap}/>);
    });

    let rows = [];
    let rowLength = CONSTANTS.squaresInRow;

    for (let i = 0; i < CONSTANTS.maxWhite; i += rowLength) {
      rows.push(squares.slice(i, i + rowLength));
    }

    return (

      <div className="wrapper">

        <h3>
          Just testing..</h3>

        <main>
          <div className="chess">

            {rows.map((row, index) => {
              //console.log('row='+row+'index='+index);
              return <div className="row" key={index}>{row}</div>
            })}
          </div>
          <div className="automove">
            <AutoMove autoMove={this.autoMove}/>
            <PrevMove prevMove={this.prevMove}/>
          </div>
        </main>
      </div>
    );
  }
}

export default Chess;
