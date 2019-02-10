import React from 'react';

class Timeslot extends React.Component {
  constructor(props) {
    super(props);

    this.confirm = this.confirm.bind(this);
  }

  confirm() {
    const { confirm, id, taken } = this.props;
    confirm(id, !taken);
  }

  render() {
    const { from, to, type, id, taken } = this.props;

    if (!from) {
      return null;
    }

    const fromDateString = from.toLocaleString();
    const toDateString = to.toLocaleString();

    return (
      <li key={id}>
        <p>From: {fromDateString} to {toDateString}. Type: {type}.
          <div>
            <button onClick={this.confirm}>{ !taken ? 'Select' : 'Cancel' }</button>
          </div>
        </p>
      </li>
    );
  }
}

export default Timeslot;
