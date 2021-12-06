import React from "react";

class King extends React.Component {
  render() {
    const divStyle = {
      fontSize: 85,
    };
    return (
      <div style={divStyle} className="piece">
        {String.fromCharCode(9818)}
      </div>
    );
  }
}
export default King;
