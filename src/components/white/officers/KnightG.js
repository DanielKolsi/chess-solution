import React from 'react';

class KnightG extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  getAcceptedMoves() {

    console.log('White Knight G');
    let acceptedMoves = [];

    return acceptedMoves;
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9816)}
        </div>
      );
    }
}
export default KnightG;
