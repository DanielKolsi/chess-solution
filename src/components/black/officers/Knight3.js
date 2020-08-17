import React from "react";
import Moves from "../../Moves";

class Knight3 extends Moves {
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
