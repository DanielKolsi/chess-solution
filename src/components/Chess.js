import React from 'react';
import Square from './Square';
import AutoMove from './AutoMove';
import update from 'immutability-helper';
//import PropTypes from 'prop-types'; // ES6

class Chess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pieces: {},
      squares: [],
      ids: [], // raw ref number of the piece, won't change
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
  possibleMoves(id) {
    const {pieces, squares, ids} = this.state;

    //const target = squares[index];
    //  let queen = pieces['wq']; // piece.location = 59
    let piece = pieces[id]; // piece.location = 59
    //console.log('piece='+piece);

    //this.refs[source.index];
    //let acceptedMoves = this.refs[target.index].refs.piece.getAcceptedMoves(target, squares);
    let acceptedMoves = this.refs[piece.location].refs.piece.getAcceptedMoves(piece, squares);
    //console.log('acceptedMoves = ' + acceptedMoves[0]);
    //this.refs[piece.location].refs.piece.getState(squares);
    //console.log('queen location = ' + queen.location);

    this.white = !this.white; // switch turn
  }

  move(src, dst) {
    const {squares, pieces, move, white, acceptedMoves} = this.state; //FIXME
    const square = squares[src];
    const mover = square.piece;
    const target = squares[dst];
    let source = squares[square.piece.location];

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

  /*movePiece(pieceId, index) {
    const {squares} = this.state;
    const target = squares[3];
    const movingPiece = target.piece;

    let source = squares[target.piece.location];
    source.piece = null;

    let destination = squares[34];
    destination.piece  = movingPiece;
    destination.piece.location = destination.index;

    this.setState({squares: update(squares, {[source.index]: {$set: source}})});
    this.setState({squares: update(squares, {[destination.index]: {$set: destination}})});
  }*/

  initBoard() {
    const squares = [];
    //const rows = [];
    //const cols = [];

    // fill board with squares
    for (let counter = 0, i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {

        let square = {index: counter} // each square has an index ranging from 0 to 63
        squares[counter] = square;
        counter++;
      }
    }
    this.setState({squares: squares});
  }

  initPieces() {
    const {squares, pieces, ids} = this.state;

    this.props.setup.forEach((item) => {
      console.log('item='+item);
      let piece = {
        location: item[0], // number 0..63
        type: item[1], // actual piece, e.g. RookBA
        id: item[2], // piece id, e.g. bra
        n: item[3] // number
      }

      squares[item[0]].piece = piece;
      console.log('piece.n='+piece.n);
      pieces[piece.n] = piece;
      //ids[item[3]] = item[3];
      //console.log('id='+ids[item[3]]);
    });


    this.setState({pieces: pieces});
    this.setState({squares: squares});
    this.setState({ids: ids});
  }

  autoMove() {


    const {pieces, squares} = this.state;

    if (this.state.white) {
      console.log('xxx  Chess: automove:'+ this.state.white);

        for (let i = 48; i < 64; i++) {
            this.possibleMoves(i);
        }
    } else { //black moves
      for (let i = 0; i < 16; i++) {
          console.log('black piece i  = ' + i + pieces[i]);
      }
    }


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
    console.log('wq new location='+pieceq.location);

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

    // Process squares into rows of length 8
    // Doing it this way rather than rendering state.rows directly allows for squares to be indexed properly
    let rows = [];
    let chunk = 8;
    for (let i = 0; i < squares.length; i += chunk) {
      rows.push(squares.slice(i, i + chunk));
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
