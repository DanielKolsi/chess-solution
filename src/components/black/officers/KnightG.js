import React from 'react';


class KnightG extends React.Component{
  
  getCandidateMoves(piece, squares) {
    //console.log('Black Knight G');
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
export default KnightG;
