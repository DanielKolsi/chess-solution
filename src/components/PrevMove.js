import React from "react";

class PrevMove extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prev: this.props.prev,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("PREVMOVE:.= " + this.state.prev);
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
      <div className="command-form">
        <form onSubmit={this.handleSubmit}>
          <br></br>
          <button id="previous" type="submit">
            222Go back to previous turn{" "}
          </button>
        </form>
      </div>
    );
  }
}

export default PrevMove;
