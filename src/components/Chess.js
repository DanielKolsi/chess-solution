import React from 'react';
import Square from './Square';
import update from 'immutability-helper';
//import PropTypes from 'prop-types'; // ES6

class Chess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pieces: {},
      squares: [],
      white: true,
      move: null,
      acceptedMoves: null
    }
    this.removePiece = this.removePiece.bind(this);
  }

  componentWillMount() {
    this.initBoard();
  }
  componentDidMount() {
    this.initPieces();

    //this.removePiece(0, 0);
    //this.move(0, 3);
    console.log('starting next move');
    this.move(3, 0);
    this.move(0, 3);
    //this.move(7, 25);

  }
  removePiece(pieceId, index) {
    // pieces are referenced in two places so need to delete both
    //delete this.state.pieces[pieceId];
    delete this.state.squares[index].piece;
    //this.setState({pieces: this.state.pieces});
    this.setState({squares: this.state.squares});
  }

    //rowcol to rowcol
    moveMap(src, dst) {
    }

  move(src, dst) {
    const {squares, pieces} = this.state;
    const square = squares[src];
    const mover = square.piece;

    let source = squares[square.piece.location];
    source.piece = null;

    let destination = squares[dst];
    if (destination.piece) {
      delete pieces[destination.piece.id];
      this.setState({pieces: pieces});
    }
    destination.piece = mover;
    destination.piece.location = dst;//destination.index;

    this.setState({squares: update(squares, {[src]: {$set: source}})});
    this.setState({squares: update(squares, {[dst]: {$set: destination}})});
    this.setState({move: null});
    console.log('updated finished');
  }

  movePiece(pieceId, index) {
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
  }

  initBoard() {
    const squares = [];
    //const rows = [];
    //const cols = [];


    // fill board with squares
    for (let counter = 0, i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {

        let square = {
        }
        squares[counter] = square;
        counter++;
      }
    }
    this.setState({squares: squares});
  }

  initPieces() {
    const {squares, pieces} = this.state;

    this.props.setup.forEach((item) => {
      console.log('item='+item);
      let piece = {
        location: item[0],
        type: item[1],
        owner: item[2],
        id: item[3]
      }

      squares[item[0]].piece = piece;
      //pieces[piece.id] = piece;
    });

    this.setState({pieces: pieces});
    //this.setState({squares: squares});
  }

  render() {
    let squares = this.state.squares.map((square, index) => {
      return (
        <Square
          key={index}
          piece={square.piece}
        />
      );
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

        <h3> Just testing..</h3>

        <main>
          <div className="chess">

            {rows.map((row, index) => {
                //console.log('row='+row+'index='+index);
              return <div className="row" key={index}>{row}</div>
            })}
          </div>

        </main>
      </div>
    );
  }
}

export default Chess;
