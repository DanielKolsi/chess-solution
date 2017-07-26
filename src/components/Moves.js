import React from 'react';


class Moves extends React.Component {

  constructor(props) {
    super(props);
        this.state = {
        enPasse: 0 // candidate for en passe, check the opponent's previous pawn move if en passe is allowed!
    }
  }


    moveKing(piece, squares) {

    }


    // en passe -> former position (former from move)
  movePawn(piece, squares) {

    const MIN_WHITE = 48; // white piece minimum value
    const MAX_BLACK = 15; // black piece max value
    const MIN_BLACK_PAWN = 8;

    let id = piece.n; // uniq piece id, non-changing
    let pos = piece.location;

    let UP = pos - 8;
    let UP2 = pos - 16;
    let LEFT_DOWN = pos - 9; // white eat
    let RIGHT_DOWN = pos - 7;
    let LEFT_UP = pos + 9; // black eat
    let RIGHT_UP = pos + 7;

    let LEFT = pos - 1;
    let RIGHT = pos + 1;
    // en passe previous moves
    let EN_PASSE_WHITE_LEFT = pos - 17;
    let EN_PASSE_WHITE_RIGHT = pos - 15;


    let acceptedMoves = [];

    // en passe -> former position

    if (id >= MIN_WHITE) { // white
        console.log('PIECE='+piece.location+piece.type+piece.id+piece.n);

        if (squares[UP].piece == null) {
            acceptedMoves.push(UP);
          if (pos >= MIN_WHITE && squares[UP2].piece == null) { // hasn't moved yet
              this.setState({enPasse: piece.location});
              acceptedMoves.push(UP2);
          }
        }
        if (squares[LEFT_DOWN].piece !== undefined && squares[LEFT_DOWN].piece.n <= MAX_BLACK) { // right up eat black
            acceptedMoves.push(LEFT_DOWN); // eat black piece
        }
        if (squares[RIGHT_DOWN].piece !== undefined && squares[RIGHT_DOWN].piece.n <= MAX_BLACK) { // right up eat black
            acceptedMoves.push(RIGHT_DOWN); // eat black piece
        }
        if (this.state.enPasse === EN_PASSE_WHITE_LEFT) {
          // FIXME: add condition for en passe (correct black pawn two up previous move)
          if (squares[LEFT].piece !== undefined && (squares[LEFT].piece.n >= MIN_BLACK_PAWN && squares[LEFT].piece.n <= MAX_BLACK)) {
              acceptedMoves.push(LEFT_UP); // en passe black pawn
          }
        }

        if (this.state.enPasse === EN_PASSE_WHITE_RIGHT) {
          if (squares[RIGHT].piece !== undefined && (squares[RIGHT].piece.n >= MIN_BLACK_PAWN && squares[RIGHT].piece.n <= MAX_BLACK)) {
              acceptedMoves.push(RIGHT_UP); // en passe black pawn
          }
        }
    } else {

    }
    return acceptedMoves;
  }
}

export default Moves;
