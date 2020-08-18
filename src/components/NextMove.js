import React from "react";

class NextMove extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    //  prevMove: 0,
      value: 0,
      white: true,
      //prev: 0,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getTurnColor() {
    
    if (this.state.white) {
      return String.fromCharCode(9898) + " ";
    } else {
      return String.fromCharCode(9899) + " ";
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.nextMove(this.state.value);
    this.setState({ white: !this.state.white, prev: this.state.value - 1 });
  }

  render() {
    return (
      <div className="command-form">
        <form onSubmit={this.handleSubmit}>
          <button type="submit" id="next">
            {" "}
            Do Next Turn for {this.getTurnColor()}
            ======================================================================
            ...turn number will be: = {this.state.value++}
          </button>
        </form>
      </div>
    );
  }
}

export default NextMove;
