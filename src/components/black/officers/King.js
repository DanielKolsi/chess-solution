import React from 'react';

class King extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9818)}
        </div>
      );
    }
}
export default King;
