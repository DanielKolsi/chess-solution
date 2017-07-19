import React from 'react';

class RookH extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

    render() {
      return (
        <div className="piece">
          {String.fromCharCode(9814)}
        </div>
      );
    }
}
export default RookH;
