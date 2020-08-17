import React from 'react';
import Chess from './components/Chess';
//import update from "immutability-helper";
//import PropTypes from 'prop-types'; // ES6

/*
    this.setState({
      // TODO: is this update/$set really necessary?!
      squares: update(squares, {
        [src]: {
          $set: srcSquare,
        },
      }),
    });
    this.setState({
      squares: update(squares, {
        [dst]: {
          $set: dstSquare,
        },
      }),
    });
*/

const App = ({setupPieceData}) => {
  return (
    <div>
      <Chess setupPieceData={setupPieceData}/>
    </div>
  );
}

export default App;
