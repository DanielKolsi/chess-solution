import React from "react";

class Knight3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getCandidateMoves(piece, squares) {
    return this.getCandidateKnightMoves(piece, squares);
  }

  render() {
    const divStyle = {
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9822)}
      </div>
    );
  }
}
export default Knight3;
