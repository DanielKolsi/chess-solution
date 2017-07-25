import React from 'react';

class RookH extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  getAcceptedMoves() {

    console.log('White Rook H');
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
export default RookH;
