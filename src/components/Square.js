import React from 'react';
import Pawn from './white/pawns/PawnA';
//import PropTypes from 'prop-types'; // ES6

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDelete: false
    }
  }

  render() {

    return (

      <div className="square" /*onClick={handleMove.bind(this, index)}*/>
        <Pawn />
      </div>
    );
  }
}

export default Square;
