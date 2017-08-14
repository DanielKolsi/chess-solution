import React from 'react';

class AutoMove extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      prevMove: 0,
      value: 0,
      prev: 0
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({prev: this.state.value - 1})
    this.props.autoMove(this.state.value);
  }

  render() {


    return (
      <div className="command-form">

        <form onSubmit={this.handleSubmit}>
          <button type="submit">Next move = {this.state.value++}</button>
        </form>
      </div>
    );
  }
}

export default AutoMove;
