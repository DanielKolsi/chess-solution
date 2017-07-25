import React from 'react';

class King extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  getAcceptedMoves() {

    console.log('White Pawn A');
    let acceptedMoves = [];

    return acceptedMoves;
  }
    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9812)}
        </div>
      );
    }
}
export default King;
