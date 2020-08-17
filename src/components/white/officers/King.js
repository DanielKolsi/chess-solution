import React from 'react';

class King extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    const divStyle = {
      color: '#aaaaaa',
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9812)}
      </div>
    );
  }
}
export default King;
