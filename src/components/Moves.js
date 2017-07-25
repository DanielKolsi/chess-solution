import React from 'react';


class Moves extends React.Component {

  movePawn(piece, squares) {

    const MIN_WHITE = 48; // white piece minimum value
    const MAX_BLACK = 15; // black piece max value

    const pos = piece.location;
    const LEFT_DOWN = pos - 9; // white eat
    const RIGHT_DOWN = pos - 7;
    const LEFT_UP = pos + 9; // black eat
    const RIGHT_UP = pos + 7;

    let acceptedMoves = [];

    // en passe -> former position

    if (pos >= MIN_WHITE) { // white

        console.log('PIECE='+piece.location+piece.type+piece.id+piece.n);

        if (squares[pos - 8].piece == null) {
            acceptedMoves.push(pos - 8);
          if (squares[pos - 16].piece == null) { // hasn't moved yet
              acceptedMoves.push(pos - 16);
          }
        }

        if (squares[LEFT_DOWN].piece !== undefined && squares[LEFT_DOWN].piece.n <= MAX_BLACK) { // right up eat black
            acceptedMoves.push(LEFT_DOWN); // eat black piece
        }

        if (squares[RIGHT_DOWN].piece !== undefined && squares[RIGHT_DOWN].piece.n <= MAX_BLACK) { // right up eat black
            acceptedMoves.push(RIGHT_DOWN); // eat black piece
        }

          // FIXME, add eating & en passe
    } else {

    }
    return acceptedMoves;
  }
}

export default Moves;
