import React from 'react';
import Square from './Square';
import AutoMove from './AutoMove';
import PrevMove from './PrevMove';
import update from 'immutability-helper';
import CONSTANTS from '../config/constants';
// import white promotions

//import PropTypes from 'prop-types'; // ES6

class Chess extends React.Component {
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
      moveNumber: 0,
      acceptedMoves: [],
      previousMove: null,
      candidateWhite: null
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


  getPossibleMoves(piece, squares) {

    console.log('piece type = ' + piece.type);
    let location = piece.location;
    let acceptedMoves = [];

    if (squares[piece.location] === null) {
      return acceptedMoves;
    }
    if (location !== undefined && this.refs[location].refs.piece !== undefined) {
      acceptedMoves = this.refs[location].refs.piece.getAcceptedMoves(piece, squares);
    }
    if (acceptedMoves !== undefined) {
      if (acceptedMoves.length > 0) {
          console.log('accepted moves size = ' + acceptedMoves.length + ' piece = ' + piece.type + ' location =' + piece.location);
      }
    }
    return acceptedMoves
  }

  move(src, dst) {
    const {squares, pieces} = this.state;
    const square = squares[src];
    let piece = square.piece;
    if (piece === null) {
        console.log('piece was null src='+src + 'dst='+dst);
        return;
    }
    const pos = 1*piece.location;

    if (piece.value === CONSTANTS.whitePawnValue && squares[dst].row === CONSTANTS.minRow) {

      let value = this.state.promotedWhiteQueenNumber;
      pieces[piece.n] = pieces[value]; // insert promoted piece to pieces
      piece = pieces[value]; // actual promotion
      piece.location = dst;
      this.setState({promotedWhiteQueenNumber: value++});
      this.setState({pieces: pieces});
    } else if (piece.value === CONSTANTS.blackPawnValue && squares[dst].row === CONSTANTS.maxRow) {
      let value = this.state.promotedBlackQueenNumber;
      pieces[piece.n] = pieces[value]; // insert promoted piece to pieces
      piece = pieces[value]; // actual promotion
      piece.location = dst;
      this.setState({promotedBlackQueenNumber: value++});
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
    console.log('moves = ' + this.state.moves.length);
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
    console.log('Prev move was: '+this.state.previousMove);
  }
  autoMove(value) {

    const {pieces, squares, white} = this.state;

    if (white === true) {
      let possibleMovesWhite = [];

      /*for (let i = CONSTANTS.minWhite; i < CONSTANTS.maxWhite + 2; i++) { //FIXME, add promotions
        let piece = pieces[i];
        if (piece === null || piece === undefined || piece.white === false) {
          continue; // piece has been e.g. eaten
        }
        console.log('piece.type = ' + piece.type + ' i = ' + i);
      }*/

      for (let i = CONSTANTS.minWhite; i < CONSTANTS.maxWhite + 2; i++) {
        let piece = pieces[i];

        if (piece === null || piece === undefined || piece.white === false) {
          continue; // piece has been e.g. eaten
        }

        //console.log('\n WHITE: piece for moving =' + piece.type + ' white = ' + piece.white + ' value =' + piece.value + ' n=' + piece.n + ' location=' + piece.location);
        //console.log('piece = ' + piece.type + piece.location + piece.n);
        let pieceMoves = this.getPossibleMoves(piece, squares);
        if (pieceMoves === undefined)
          continue;
        if (pieceMoves.length > 0 && possibleMovesWhite.length === undefined) {
          possibleMovesWhite = pieceMoves;
        } else if (pieceMoves.length > 0) {
          console.log('adding piecemoves, i = ' + i + ' n = ' + pieceMoves.length + ' p m w length = ' + possibleMovesWhite.length);
          if (!possibleMovesWhite.includes(pieceMoves)) {
            possibleMovesWhite = possibleMovesWhite.concat(pieceMoves); // possiblemoves, removalmoves, acceptedmoves
          }
        }
      }

      if (possibleMovesWhite !== undefined && possibleMovesWhite.length > 0) { // FIXME, no moves available?
        const n = Math.floor(Math.random() * possibleMovesWhite.length);
        const whiteMoves = possibleMovesWhite[n].split('#');
        this.setState({previousMove: possibleMovesWhite[n]});

        this.setState({candidateWhite: whiteMoves[1]}); // this square is "occupied"
        this.move(whiteMoves[0], whiteMoves[1]);

        for (let i = 0; i < possibleMovesWhite.length; i++) {
          console.log(' i = ' + i + ' candidate move = ' + possibleMovesWhite[i]);
        }
        console.log('WHITE MOVED * total moves were = ' + possibleMovesWhite.length + ' selected random = ' + possibleMovesWhite[n] + ' i was = ' + n);
        this.setState({white: false});
      }
    } else {
      let possibleMovesBlack = {};

      for (let i = CONSTANTS.minBlack; i <= CONSTANTS.maxBlack; i++) {
        let piece = pieces[i];

        if (piece == null || piece === undefined || piece.white === true) {
          continue; // piece has been e.g. eaten
        }
        let pieceMoves = this.getPossibleMoves(piece, squares);
        if (pieceMoves === undefined)
          continue;

        if (pieceMoves.length > 0 && possibleMovesBlack.length === undefined) {
          possibleMovesBlack = pieceMoves;
        } else if (pieceMoves.length > 0) {
          if (!possibleMovesBlack.includes(pieceMoves)) {
            possibleMovesBlack = possibleMovesBlack.concat(pieceMoves); // possiblemoves, removalmoves, acceptedmoves
          }
        }
      }

      if (possibleMovesBlack !== undefined && possibleMovesBlack.length > 0) { // FIXME, no moves available?
        const n = Math.floor(Math.random() * possibleMovesBlack.length);

        const blackMoves = possibleMovesBlack[n].split('#');
        this.setState({previousMove: possibleMovesBlack[n]});
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
           <PrevMove prevMove={this.prevMove}/>
          </div>
        </main>
      </div>
    );
  }
}

export default Chess;
