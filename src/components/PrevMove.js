import React from "react";

class PrevMove extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prev: 0,
      next: 1,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    if (this.state.prev > 0) {
      document.getElementById("previous").disabled = false;
      console.log("PREVMOVE:..");
      e.preventDefault();
      //this.props.prevMove(this.state.value++);
      this.props.prevMove(this.state.value);
      this.setState({ next: this.state.value - 1 });
      this.setState({ prev: this.state.value - 1 });
    } else {
      document.getElementById("previous").disabled = true;
    }
  }

  render() {
    return (
      <div className="command-form2">
        <form onSubmit={this.handleSubmit}>
          <br></br>
          <button id="previous" type="submit">
            Go back to previous turn{" "}
          </button>
        </form>
      </div>
    );
  }
}

export default PrevMove;
