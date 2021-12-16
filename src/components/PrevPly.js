import React from "react";

class PrevPly extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.props.next === 2) {
      // we cannot go behind the first move, i.e. when 'next' will be 2
      this.props.prevPly(); // calling passed function prevTurn
      document.getElementById("previous").disabled = true;
    } else {
      this.props.prevPly(); // calling passed function prevTurn
    }
  }

  render() {
    return (
      <div className="command-form">
        <form onSubmit={this.handleSubmit}>
          <br></br>
          <button id="previous" type="submit">
            Go back to previous ply.{" "}
          </button>
        </form>
      </div>
    );
  }
}

export default PrevPly;
