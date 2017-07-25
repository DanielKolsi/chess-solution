import React from 'react';

class BishopC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getAcceptedMoves() {

    console.log('White Bishop C');
    let acceptedMoves = [];

    return acceptedMoves;
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9815)}
        </div>
      );
    }
}
export default BishopC;
