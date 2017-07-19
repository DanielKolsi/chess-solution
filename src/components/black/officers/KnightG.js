import React from 'react';

class KnightG extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9822)}
        </div>
      );
    }
}
export default KnightG;
