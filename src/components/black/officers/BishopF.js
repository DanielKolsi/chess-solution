import React from 'react';

class BishopF extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
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
