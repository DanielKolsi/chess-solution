import React from 'react';


class Moves extends React.Component {

  movePawn(piece, squares) {

    let acceptedMoves = [];

    if (piece.n > 47) { // white
        console.log('PIECE='+piece.location+piece.type+piece.id+piece.n);
        if (piece.location > 47) { // hasn't moved yet
            acceptedMoves.push(piece.location - 16);
        }
          acceptedMoves.push(piece.location - 8);
          // FIXME, add eating & en passe
    } else {

    }
    return acceptedMoves;
  }
}

export default Moves;
