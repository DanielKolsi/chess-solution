import React from 'react';

class Queen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getAcceptedMoves(piece, squares) {

    console.log('White Queen');
    let acceptedMoves = [];

    return acceptedMoves;
  }

  render() {
    return (
      <div className="piece">
        {String.fromCharCode(9813)}
      </div>
    );
  }
}
export default Queen;
