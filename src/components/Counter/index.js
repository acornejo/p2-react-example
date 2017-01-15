import React from 'react';
import './style.css';

class Counter extends React.Component {
  static propTypes = {
    start: React.PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { count: props.start };
  }

  render() {
    return (
      <div
        className="counter"
        onClick={() => this.setState({ count: this.state.count + 1 })}
      >
        {this.state.count}
      </div>
    );
  }
}

export default Counter;
