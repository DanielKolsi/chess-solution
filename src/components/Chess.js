import React from 'react';
import Square from './Square';
//import PropTypes from 'prop-types'; // ES6

class Chess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pieces: {},
      squares: []
    }
  }
  componentWillMount() {
    this.initBoard();
  }
  componentDidMount() {
    this.initPieces();
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
