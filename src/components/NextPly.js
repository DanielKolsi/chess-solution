import React from "react";

class NextPly extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getTurnColor() {
    if (this.props.next % 2 !== 0) {
      return String.fromCharCode(9898) + " ";
    } 
      else return String.fromCharCode(9899) + " ";
  }

  handleSubmit(e) {
    e.preventDefault();
    document.getElementById("previous").disabled = false;
    this.props.nextPly(); // called passed function (from Chess) nextPly()
  }

  render() {
    return (
      <div className="command-form">
        <form onSubmit={this.handleSubmit}>
          <button type="submit" id="next">
            {" "}
            Do Next Ply for {this.getTurnColor()}
            ======================================================================
            ...ply number will be: = {this.props.next}
          </button>
          <br></br>
        </form>
      </div>
    );
  }
}

export default NextPly;
