import React from 'react';

class PrevMove extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.prevMove(this.state.value++);
  }


  render() {
    return (
      <div className="command-form">

        <form onSubmit={this.handleSubmit}>
          <button type="submit">Prev move </button>
        </form>
      </div>
    );
  }
}

export default PrevMove;
