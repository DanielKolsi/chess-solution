import React from 'react';

class BishopC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9813)}
        </div>
      );
    }
}
export default BishopC;
