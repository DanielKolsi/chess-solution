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

    let location = piece.location; //FIXME
    let acceptedMoves = {};

    if (location !== undefined && this.refs[location].refs.piece !== undefined) {
      console.log('***piece = ' + piece.type + ' location='+piece.location + 'refs piece type = ' + this.refs[location].refs.piece[0]);
      acceptedMoves = this.refs[location].refs.piece.getAcceptedMoves(piece, squares);

    }
    if (acceptedMoves !== undefined) {
        console.log('accepted moves size = ' + acceptedMoves.length + ' piece = '+piece.type + ' location ='+piece.location);
    }

    return acceptedMoves
  }

  move(src, dst) {
    const {squares, pieces} = this.state;
    const square = squares[src];
    let piece = square.piece;
    const pos = piece.location;

    if (piece.value === CONSTANTS.whitePawnValue && squares[dst].row === CONSTANTS.minRow) {
      pieces[piece.n] = pieces[64]; // insert promoted piece to pieces
      piece = pieces[64]; // actual promotion
      piece.location = dst;
      this.setState({pieces: pieces});
    } else if (piece.value === CONSTANTS.blackPawnValue && squares[dst].row === CONSTANTS.maxRow) {
      pieces[piece.n] = pieces[65]; // insert promoted piece to pieces
      piece = pieces[65]; // actual promotion
    }

    let mover = piece;
    let source = squares[pos];

    source.piece = null;
    let destination = squares[dst];

    if (destination.piece) {
      console.log('deleting: ' + destination.piece.type + ' id = ' + destination.piece.id + ' n='+destination.piece.n);
      //pieces[destination.piece.id] = null; //FIXME, is required?
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

  autoMove(value) {

    const {pieces, squares, white} = this.state;


    if (white === true) {
      let possibleMovesWhite = {};

      for (let i = CONSTANTS.minWhite; i < CONSTANTS.maxWhite; i++) {
        let piece = pieces[i];

        if (piece === null || piece === undefined) {
          continue; // piece has been e.g. eaten
        }
        //FIXME: wrongly identifies the piece!
        console.log('\n WHITE: piece for moving =' + piece.type + ' white = ' + piece.white + ' value =' + piece.value + ' n='+piece.n + ' location='+piece.location);

        //console.log('piece = ' + piece.type + piece.location + piece.n);
        let pieceMoves = this.getPossibleMoves(piece, squares);
        if (pieceMoves === undefined) continue;
        if (pieceMoves.length > 0 && possibleMovesWhite.length === undefined) {
          possibleMovesWhite = pieceMoves;
        } else if (pieceMoves.length > 0) {
          console.log('adding piecemoves, i = ' + i + ' n = ' + pieceMoves.length);
          possibleMovesWhite = possibleMovesWhite.concat(pieceMoves); // possiblemoves, removalmoves, acceptedmoves
        }
      }

      if (possibleMovesWhite !== undefined && possibleMovesWhite.length > 0) { // FIXME, no moves available?
        const n = Math.floor(Math.random() * possibleMovesWhite.length);
        const whiteMoves = possibleMovesWhite[n].split('#');

        this.move(whiteMoves[0], whiteMoves[1]);


        for (let i = 0; i < possibleMovesWhite.length; i++) {
          console.log(' i = ' + i + ' candidate move = ' + possibleMovesWhite[i]);
        }
        console.log('WHITE MOVED * total moves were = ' + possibleMovesWhite.length + ' selected random = ' + possibleMovesWhite[n] + ' i was = ' + n);
        this.setState({white: false});
      } else {
        console.log('ERROR2');
      }

    } else {
      let possibleMovesBlack = {};

      for (let i = CONSTANTS.minBlack; i <= CONSTANTS.maxBlack; i++) {
        let piece = pieces[i];

        if (piece == null || piece === undefined) {
          continue; // piece has been e.g. eaten
        }
        let pieceMoves = this.getPossibleMoves(pieces[i], squares);


        if (pieceMoves.length > 0 && possibleMovesBlack.length === undefined) {
          possibleMovesBlack = pieceMoves;
        } else if (pieceMoves.length > 0) {
          possibleMovesBlack = possibleMovesBlack.concat(pieceMoves); // possiblemoves, removalmoves, acceptedmoves
        }
      }

      if (possibleMovesBlack !== undefined && possibleMovesBlack.length > 0) { // FIXME, no moves available?
        const n = Math.floor(Math.random() * possibleMovesBlack.length);

        const blackMoves = possibleMovesBlack[n].split('#');
        this.move(blackMoves[0], blackMoves[1]);
        console.log('BLACK MOVED * total moves were = ' + possibleMovesBlack.length + ' selected random = ' + possibleMovesBlack[n] + ' n was = ' + n);
        this.setState({white: true});
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

          </div>
        </main>
      </div>
    );
  }
}

export default Chess;
