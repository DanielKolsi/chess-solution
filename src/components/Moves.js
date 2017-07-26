import React from 'react';


class Moves extends React.Component {

  constructor(props) {
    super(props);
        this.state = {
        enPasse: 0 // candidate for en passe (prev move two up)
    }
  }

    // en passe -> former position (former from move)
  movePawn(piece, squares) {

    const MIN_WHITE = 48; // white piece minimum value
    const MAX_BLACK = 15; // black piece max value

    const id = piece.n; // uniq piece id, non-changing
    const pos = piece.location;

    const UP = pos - 8;
    const UP2 = pos - 16;
    const LEFT_DOWN = pos - 9; // white eat
    const RIGHT_DOWN = pos - 7;
    const LEFT_UP = pos + 9; // black eat
    const RIGHT_UP = pos + 7;
    const MIN_BLACK_PAWN = 8;
    const LEFT = pos - 1;
    const RIGHT = pos + 1;

    let acceptedMoves = [];

    // en passe -> former position

    if (id >= MIN_WHITE) { // white

        console.log('PIECE='+piece.location+piece.type+piece.id+piece.n);

        if (squares[UP].piece == null) {
            acceptedMoves.push(UP);
          if (pos >= MIN_WHITE && squares[UP2].piece == null) { // hasn't moved yet
              this.state.enPasse = piece.location;
              acceptedMoves.push(UP2);
          }
        }

        if (squares[LEFT_DOWN].piece !== undefined && squares[LEFT_DOWN].piece.n <= MAX_BLACK) { // right up eat black
            acceptedMoves.push(LEFT_DOWN); // eat black piece
        }

        if (squares[RIGHT_DOWN].piece !== undefined && squares[RIGHT_DOWN].piece.n <= MAX_BLACK) { // right up eat black
            acceptedMoves.push(RIGHT_DOWN); // eat black piece
        }

        // FIXME: add condition for en passe (correct black pawn two up previous move)
        if (squares[LEFT].piece !== undefined && (squares[LEFT].piece.n >= MIN_BLACK_PAWN && squares[LEFT].piece.n <= MAX_BLACK)) {
            acceptedMoves.push(LEFT_UP); // en passe black pawn
        }
        if (squares[RIGHT].piece !== undefined && (squares[RIGHT].piece.n >= MIN_BLACK_PAWN && squares[RIGHT].piece.n <= MAX_BLACK)) {
            acceptedMoves.push(RIGHT_UP); // en passe black pawn
        }

    } else {

    }
    return acceptedMoves;
  }
}

export default Moves;
