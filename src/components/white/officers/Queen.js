import React from 'react';

class Queen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getAcceptedMoves(pieceId, squares) {
    console.log('white queen valid moves');
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
