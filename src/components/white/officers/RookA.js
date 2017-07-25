import React from 'react';

class RookA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
    getAcceptedMoves() {

      console.log('White Rook A');
      let acceptedMoves = [];

      return acceptedMoves;
    }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9814)}
        </div>
      );
    }
}
export default RookA;
