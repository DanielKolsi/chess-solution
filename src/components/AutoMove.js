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
    this.handleSubmitPrev = this.handleSubmitPrev.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({prev: this.state.value - 1})
    this.setState({value: this.state.value++})

    this.props.autoMove(this.state.value++);

  }
  handleSubmitPrev(e) {
    e.preventDefault();
    this.props.autoMove(this.state.prevMove); //FIXME, correct format

  }

  render() {
    return (
      <div className="command-form">

        <form onSubmit={this.handleSubmit}>
          <button type="submit">Next move = {this.state.value++}</button>
        </form>
        <form onSubmit={this.handleSubmitPrev}>
          <button type="submit">Prev move = {this.state.prev}</button>
        </form>
      </div>
    );
  }
}

export default AutoMove;
