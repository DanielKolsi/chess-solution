import React from 'react';

class AutoMove extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    console.log('submitting move='+e);
    e.preventDefault();
    this.props.autoMove(this.state.value);
    //this.setState({value: ''});
  }
  render() {
    return (
      <div className="command-form">

        <form onSubmit={this.handleSubmit}>
          <button type="submit">Next move</button>
        </form>
      </div>
    );
  }
}

export default AutoMove;
