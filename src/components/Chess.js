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
      promotedBlackQueenNumber: 66,
      //      ids: [], // raw ref number of the piece, won't change
      white: true,
      moves: [],
      nextMove: 1,
      candidateMoves: [],
      previousMove: null
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
        console.log('prev-move='+this.state.previousMove);
        candidateMoves = this.refs[location].refs.piece.getCandidateMoves(piece, squares, this.state.previousMove);
    }
    /*if (candidateMoves !== undefined) {
      if (candidateMoves.length > 0) {
          console.log('accepted moves size = ' + candidateMoves.length + ' piece = ' + piece.type + ' location =' + piece.location);
      }
    }*/
    return candidateMoves
  }

  move(src, dst) {
    const {squares, pieces} = this.state;
    const square = squares[src];
    let piece = square.piece;

    if (piece === null) {
      console.log('piece was null src=' + src + 'dst=' + dst);
      return;
    }
    const pos = 1 * piece.location;

    if (piece.value === CONSTANTS.whitePawnValue && squares[dst].row === CONSTANTS.minRow) {

      let value = this.state.promotedWhiteQueenNumber;
      pieces[piece.n] = pieces[value]; // insert promoted piece to pieces
      piece = pieces[value]; // actual promotion
      piece.location = dst;
      this.setState({
        promotedWhiteQueenNumber: value++
      });
      this.setState({pieces: pieces});
    } else if (piece.value === CONSTANTS.blackPawnValue && squares[dst].row === CONSTANTS.maxRow) {
      let value = this.state.promotedBlackQueenNumber;
      pieces[piece.n] = pieces[value]; // insert promoted piece to pieces
      piece = pieces[value]; // actual promotion
      piece.location = dst;
      this.setState({
        promotedBlackQueenNumber: value++
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
      delete pieces[destination.piece.id];
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
    for (let idx = 0, i = 0; i < 9; i++) {
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

      squares[item[0]].piece = piece;
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

    let possibleMovesWhite = [];

    for (let i = CONSTANTS.minWhite; i < (CONSTANTS.maxWhite + CONSTANTS.numberOfExtraPieces); i++) {
      let piece = pieces[i];

      if (piece === null || piece === undefined || piece.white === false) {
        continue; // piece has been e.g. eaten
      }

      //console.log('\n WHITE: piece for moving =' + piece.type + ' white = ' + piece.white + ' value =' + piece.value + ' n=' + piece.n + ' location=' + piece.location);
      //console.log('piece = ' + piece.type + piece.location + piece.n);
      let pieceMoves = this.getCandidateMoves(piece, squares);

      if (pieceMoves === undefined) {
        console.log('No available moves for this piece.');
        continue;
      }

      if (pieceMoves.length > 0 && possibleMovesWhite.length === undefined) {
        possibleMovesWhite = pieceMoves;
      } else if (pieceMoves.length > 0) {
        //console.log('adding piecemoves, i = ' + i + ' n = ' + pieceMoves.length + ' p m w length = ' + possibleMovesWhite.length);
        if (!possibleMovesWhite.includes(pieceMoves)) {
          possibleMovesWhite = possibleMovesWhite.concat(pieceMoves); // possiblemoves, removalmoves, candidateMoves
        }
      }
    }
    return possibleMovesWhite;
  }

  /*
    This function is both for checking candidate moves for white / black AND for
    using as a "rejector" for the candidate move when opponentKing and opponentCandidateMove are specified.
  */
  getCandidateMovesBlack(squares, pieces, opponentKing, opponentCandidateMove) {

    let possibleMovesBlack = [];

    for (let i = CONSTANTS.minBlack; i < (CONSTANTS.maxBlack + CONSTANTS.numberOfExtraPieces); i++) {
      let piece = pieces[i];

      if (piece == null || piece === undefined || piece.white === true) {
        continue; // piece has been e.g. eaten
      }

      let pieceMoves = this.getCandidateMoves(piece, squares, opponentKing, opponentCandidateMove);

      if (pieceMoves == null && opponentCandidateMove != null) {
        //console.log('candidate WHITE move rejected, no possible moves, rejected_move='+opponentCandidateMove);
        return null; // previous white move candidate is simply rejected!
      } else if (pieceMoves === undefined) {
        console.log('No available moves for this piece.');
        continue;
      }
      if (pieceMoves === undefined) {
        continue;
      }

      if (pieceMoves.length > 0 && possibleMovesBlack.length === undefined) { //FIXME,possibleMovesBlack was null
        possibleMovesBlack = pieceMoves;
      } else if (pieceMoves.length > 0) {
        if (!possibleMovesBlack.includes(pieceMoves)) {
          possibleMovesBlack = possibleMovesBlack.concat(pieceMoves); // possiblemoves, removalmoves, candidateMoves
        }
      }
    }
    return possibleMovesBlack;
  }

  /**
   * From the possible moves return those moves which are actually allowed.
   * @param  {[type]} possibleMovesWhite [description]
   * @param  {[type]} kingPosition       [description]
   * @param  {[type]} squares            [description]
   * @param  {[type]} pieces             [description]
   * @return {[type]}                    allowedMoves
   */
  getAllowedMovesWhite(squares, pieces, whiteKingPosition, possibleMovesWhite) {

    let allowedMoves = []; // contains only the candidate moves that were eventually verified to be allowed

    console.log('white_king_pos=' + whiteKingPosition);

    for (let i = 0; i < possibleMovesWhite.length; i++) {

      const move = possibleMovesWhite[i].split('#'); // [1] == dst move
      const src = 1 * move[0];
      const dst = 1 * move[1];
      let kingPosition = whiteKingPosition;

      console.log('pos_move=' + move + 'src=' + src + 'whiteKingPosition=' + whiteKingPosition);

      if (src === whiteKingPosition) { // white king move candidate!
        kingPosition = dst;
        console.log('king_move, dst=' + dst);
      }

      if (this.isWhiteMoveAllowed(squares, pieces, kingPosition, possibleMovesWhite[i])) {
        allowedMoves.push(possibleMovesWhite[i]);
      } else {
        console.log('rejected: ' + possibleMovesWhite[i]);
        continue; // this candidate move was rejected, check the next white candidate move
      }
    }
    return allowedMoves;
  }

  getAllowedMovesBlack(squares, pieces, blackKingPosition, possibleMovesBlack) {

    let allowedMoves = []; // contains only the candidate moves that were eventually verified to be allowed

    console.log('black_king_pos=' + blackKingPosition);

    for (let i = 0; i < possibleMovesBlack.length; i++) {

      const move = possibleMovesBlack[i].split('#'); // [1] == dst move
      const src = 1 * move[0];
      const dst = 1 * move[1];
      let kingPosition = blackKingPosition;

      console.log('pos_move=' + move + 'src=' + src + 'blackKingPosition=' + blackKingPosition);

      if (src === blackKingPosition) { // black king move candidate!
        kingPosition = dst;
        console.log('king_move, dst=' + dst);
      }

      if (this.isBlackMoveAllowed(squares, pieces, kingPosition, possibleMovesBlack[i])) {
        allowedMoves.push(possibleMovesBlack[i]);
      } else {
        console.log('rejected-black: ' + possibleMovesBlack[i]);
        continue; // this candidate move was rejected, check the next white candidate move
      }
    }
    return allowedMoves;
  }

  // to check whether a white move is allowed, you need to check opponent's next possible moves
  // if any black move collides with the white king, the white candidate move is rejected immediately
  isWhiteMoveAllowed(squares, pieces, whiteKingPosition, whiteCandidateMove) {
    let allowed = true;

    const whiteKingRow = pieces[CONSTANTS.whiteKingId].row;
    const whiteKingCol = pieces[CONSTANTS.whiteKingId].col;


    for (let i = CONSTANTS.minBlack; i < (CONSTANTS.maxBlack + CONSTANTS.numberOfExtraPieces); i++) {
      let piece = pieces[i];

      if (piece === null || piece === undefined) {
        continue; // piece has been e.g. eaten
      }

      if (whiteCandidateMove !== undefined) {
        const pos = 1 * piece.location;
        const move = whiteCandidateMove.split('#'); // [1] == dst move
        const canditDst = 1 * move[1];
        if (canditDst === pos) {
          return allowed; // this white piece has been eaten (for this candidate move)!
        }
      }

      //let value = Math.abs(piece.value);
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
          if (whiteKingRow === piece.row || (whiteKingCol === piece.col)) {
            allowed = this.isAllowedByRook(piece, squares, whiteKingPosition, whiteCandidateMove);
          }
          break;
        case - 6:
          // FIXME add eating generally
          allowed = this.isAllowedByKing(piece, whiteKingPosition);
          console.log('allowedByKing=' + allowed + ' whiteKingDst=' + whiteKingPosition);
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

    let allowed = true;

    const blackKingRow = pieces[CONSTANTS.blackKingId].row;
    const blackKingCol = pieces[CONSTANTS.blackKingId].col;

    for (let i = CONSTANTS.minWhite; i < (CONSTANTS.maxWhite + CONSTANTS.numberOfExtraPieces); i++) {
      let piece = pieces[i];

      if (piece === null || piece === undefined) {
        continue; // piece has been e.g. eaten
      }

      //let value = Math.abs(piece.value);
      let value = piece.value;

      if (blackCandidateMove !== undefined) {
        const pos = 1 * piece.location;
        const move = blackCandidateMove.split('#'); // [1] == dst move
        const canditDst = 1 * move[1];
        if (canditDst === pos) {
          return allowed; // this white piece has been eaten (for this candidate move)!
        }
      }

      switch (value) {
        case - 1:

          allowed = this.isAllowedByBlackPawn(piece, blackKingPosition);
          break;
        case - 3:
          allowed = this.isAllowebByKnight(piece, blackKingPosition);
          break;
        case - 4:
          allowed = this.isAllowedByBishop(piece, squares, blackKingPosition, blackCandidateMove);
          break;
        case - 5:
          if (blackKingRow === piece.row || (blackKingCol === piece.col)) {
            allowed = this.isAllowedByRook(piece, squares, blackKingPosition, blackCandidateMove);
          }
          break;
        case - 6:
          // FIXME add eating generally
          allowed = this.isAllowedByKing(piece, blackKingPosition);
          console.log('allowedByKing=' + allowed + ' blackKingDst=' + blackKingPosition);
          break;
        case - 9:
          // FIXME, if queene is eaten straight away as the candidate move? -> allow = true
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

    console.log('nextMove = ' + nextMove);
    this.setState({nextMove: nextMove});

    const {pieces, squares, white} = this.state;

    if (white === true) {
      let candidateMovesWhite = this.getCandidateMovesWhite(squares, pieces);
      console.log('candidate white moves =' + candidateMovesWhite);
      let allowedMovesWhite = this.getAllowedMovesWhite(squares, pieces, pieces[CONSTANTS.whiteKingId].location, candidateMovesWhite);
      console.log('allowed white moves =' + allowedMovesWhite);

      if (allowedMovesWhite !== null && allowedMovesWhite.length > 0) { // FIXME, no moves available?
        const n = Math.floor(Math.random() * allowedMovesWhite.length);
        console.log('previousMove:'+allowedMovesWhite[n]);
        this.setState({previousMove: allowedMovesWhite[n]});
        const whiteMoves = allowedMovesWhite[n].split('#');
        this.move(whiteMoves[0], whiteMoves[1]); // FIXME: add special handling for en passe
        this.setState({white: false});
      } else {
        console.log('CHECK MATE, BLACK wins or stalemate.'); // FIXME, add staelmate handling
      }
    } else {
      let candidateMovesBlack = this.getCandidateMovesBlack(squares, pieces);
      console.log('candidate black moves =' + candidateMovesBlack);
      let allowedMovesBlack = this.getAllowedMovesBlack(squares, pieces, pieces[CONSTANTS.blackKingId].location, candidateMovesBlack);
      console.log('allowed black moves =' + allowedMovesBlack);

      if (allowedMovesBlack !== null && allowedMovesBlack.length > 0) { // FIXME, no moves available?
        const n = Math.floor(Math.random() * allowedMovesBlack.length);

        const blackMoves = allowedMovesBlack[n].split('#');
        this.setState({previousMove: allowedMovesBlack[n]});
        this.setState({candidateBlack: blackMoves[1]}); // this square is "occupied"
        this.move(blackMoves[0], blackMoves[1]);
        console.log('BLACK MOVED * total moves were = ' + allowedMovesBlack.length + ' selected random = ' + allowedMovesBlack[n] + ' n was = ' + n);
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
