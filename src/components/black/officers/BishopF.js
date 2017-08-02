import React from 'react';

class BishopF extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  getAcceptedMoves(piece, squares) {
    console.log('Black Bishop F');
    return this.getBishopMoves(piece, squares);
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9821)}
        </div>
      );
    }
}
export default BishopF;
