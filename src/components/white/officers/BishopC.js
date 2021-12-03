import React from "react";

class BishopC extends React.Component {

  getCandidateMoves(piece, squares) {
    //console.log('White Bishop C');
    return this.getCandidateBishopMoves(piece, squares);
  }

  render() {
    const divStyle = {
      color: "#aaaaaa",
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9815)}
      </div>
    );
  }
}
export default BishopC;
