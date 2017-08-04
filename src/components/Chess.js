import React from 'react';
import Square from './Square';
import AutoMove from './AutoMove';
import update from 'immutability-helper';
import CONSTANTS from '../config/constants';
//import PropTypes from 'prop-types'; // ES6

class Chess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pieces: {},
      squares: [],
      //      ids: [], // raw ref number of the piece, won't change
      white: true,
      move: null,
      acceptedMoves: null
    }
    this.moveMap = this.moveMap.bind(this); //FIXME
    this.removePiece = this.removePiece.bind(this);
    this.autoMove = this.autoMove.bind(this);
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

  //FIXME: get pieceId from index and index from pieceId
  getPossibleMoves(piece, squares) {

    let location = piece.location;
    let acceptedMoves = {};

    if (location !== undefined) {
      acceptedMoves = this.refs[location].refs.piece.getAcceptedMoves(piece, squares);
      console.log('acceptedmoves size = ' + acceptedMoves.length + '\n\n');
    }

    this.setState({
      white: !this.white
    }); // switch turn
    console.log('accepted moves size = ' + acceptedMoves.length);
    return acceptedMoves
  }

  move(src, dst) {
    const {squares, pieces} = this.state;
    const square = squares[src];
    const pos = square.piece.location;
    const mover = square.piece;
    //const target = squares[dst]; // FIXME, not required?
    let source = squares[pos];

    source.piece = null;

    let destination = squares[dst];
    if (destination.piece) {
      delete pieces[destination.piece.id];
      this.setState({pieces: pieces});
    }
    destination.piece = mover;
    destination.piece.location = dst; //destination.index;

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
    this.setState({pieces: pieces});
    this.setState({move: null});
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

  autoMove(value) {

    const {pieces, squares} = this.state;

    console.log('xxx  Chess: automove:' + this.state.white + ' move number = ' + value);
    let possibleMovesWhite = {};

    for (let i = CONSTANTS.minWhite; i < CONSTANTS.maxWhite; i++) {
      let piece = pieces[i];

      if (piece == null) {
        continue; // piece has been e.g. eaten
      }

      let pieceMoves = this.getPossibleMoves(pieces[i], squares);

      if (pieceMoves.length > 0 && possibleMovesWhite.length === undefined) {
        possibleMovesWhite = pieceMoves;
      } else if (pieceMoves.length > 0) {
        possibleMovesWhite = possibleMovesWhite.concat(pieceMoves); // possiblemoves, removalmoves, acceptedmoves
      }
    }
    // select a move and execute it!  moveMap(sr, sc, dr, dc) { //FIXME
    console.log('Possible moves white, total = ' + possibleMovesWhite.length);

    let possibleMovesBlack = {};

    for (let i = CONSTANTS.minBlack; i <= CONSTANTS.maxBlack; i++) {
      let piece = pieces[i];
      if (piece == null) {
        continue; // piece has been e.g. eaten
      }
      let pieceMoves = this.getPossibleMoves(pieces[i], squares);
      console.log('pieceMoves black = ' + pieceMoves.length);

      if (pieceMoves.length > 0 && possibleMovesBlack.length === undefined) {
        possibleMovesBlack = pieceMoves;
      } else if (pieceMoves.length > 0) {
        possibleMovesBlack = possibleMovesBlack.concat(pieceMoves); // possiblemoves, removalmoves, acceptedmoves
      }
    }

    console.log('Possible moves black, total = ' + possibleMovesBlack.length + ' first = ' + possibleMovesBlack[0]);
    //this.move(0, 33);

    /*
    let pieceId = 59;
    this.possibleMoves(59); // white queen //FIXME

    let movingPiece = pieces[59];
    let piece = pieces[59];

    //console.log('starting next move');

    let source = squares[piece.location];
    source.piece = null;

    let index = 63;
    let destination = squares[index];
    if (destination.piece) {
      delete pieces[destination.piece.id];
      this.setState({pieces: pieces});
    }

    destination.piece = movingPiece;

    destination.piece.location = destination.index;
    console.log('piece = ' + piece.location + ' dst idx = ' + destination.index);
    this.setState({
      squares: update(squares, {
        [source.index]: {
          $set: source
        }
      })
    });
    console.log('dst idx='+destination.index);
    this.setState({
      squares: update(squares, {
        [destination.index]: {
          $set: destination
        }
      })
    });

    let pieceq = pieces[59];
    console.log('wq new location='+pieceq.location);*/

    /*this.moveMap(2, 5, 4, 5); // white
    this.moveMap(7, 2, 5, 2); // black
    this.moveMap(4, 5, 5, 5); // white
    this.moveMap(7, 4, 5, 4); // black
    this.moveMap(5, 5, 6, 4); // white

    this.removePiece(0, 27); // en passe*/

    //  this.possibleMoves(59); // white queen //FIXME
  }

  render() {
    let squares = this.state.squares.map((square, index) => {
      return (<Square ref={index} key={index} index={index} chessId={square.chessId} piece={square.piece} moveMap={this.moveMap}/>);
    });

    let rows = [];
    let rowLength = CONSTANTS.squaresInRow;

    for (let i = 0; i < squares.length; i += rowLength) {
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

          </div>
        </main>
      </div>
    );
  }
}

export default Chess;
