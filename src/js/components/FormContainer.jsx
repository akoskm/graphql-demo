import React, { Component } from "react";
import ReactDOM from "react-dom";

import Timeslot from './Timeslot.jsx';

const postData = (url = ``, data = {}) => {
  // Default options are marked with *
  return fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
          "Content-Type": "application/json",
          // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  .then(response => response.json()); // parses response to JSON
}

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.addTimeslot = this.addTimeslot.bind(this);
    this.state = {
      timeslots: [],
      timeslot: {}
    };
  }

  loadData(type) {
    const query = `
      query AvailableTimes ($type: String) {
        timeslots(type: $type) {
          _id
          from
          to
          type,
          taken
        }
      }
    `;
    const payload = { query };
    if (type) {
      payload.variables = { type };
    }
    postData('http://localhost:4000/graphql', payload)
      .then((response) => {
        this.setState({ ...response.data });
      });
  }

  componentDidMount() {
    this.loadData();
  }

  confirm(id, taken) {
    postData('http://localhost:4000/graphql', { query: `mutation { editTimeslot (_id: "${id}", taken: ${taken}) { taken } }` })
      .then((response) => {
        // this.setState({ ...response.data });
        this.loadData();
      });
  }

  addTimeslot(e) {
    // console.log(this.state.timeslot);
    const { from, to, type, day} = this.state.timeslot;
    const date = new Date();
    const timeFrom = new Date(date.getFullYear(), date.getMonth(), day, from).toISOString();
    const timeTo = new Date(date.getFullYear(), date.getMonth(), day, to).toISOString();
    postData('http://localhost:4000/graphql', { query: `mutation { addTimeslot (type: "${type}", from: "${timeFrom}", to: "${timeTo}") { _id } }` })
      .then((response) => {
        // this.setState({ ...response.data })
        this.loadData();
      });
  }

  onChange(e) {
    const { name, value } = e.target;
    const timeslot = Object.assign(this.state.timeslot, { [name]: value })
    this.setState({
      timeslot
    });
  }

  onFilterChange({ target: {name, value}}) {
    this.loadData(value);
  }

  renderTimeslots() {
    if (this.state.timeslots.length < 1) {
      return 'No available dates.';
    }

    const anyTaken = this.state.timeslots.some(({taken}) => taken);

    return this.state.timeslots.filter(({ taken}) => {
      return taken === anyTaken;
    }).map(({ from, to, type, _id, taken }) => (
      <Timeslot
        id={_id}
        from={new Date(parseInt(from, 10))}
        to={new Date(parseInt(to, 10))}
        type={type}
        confirm={this.confirm}
        taken={taken}
      />
    ));
  }

  render() {
    return (
      <div>
        <label>Filter</label>
        <select name="type" onChange={this.onFilterChange}>
          <option value="">- Please select -</option>
          <option value="Interview">Interview</option>
          <option value="Meeting">Meeting</option>
        </select>
        <ul>
          {this.renderTimeslots()}
        </ul>
        <form>
          <h3>Add:</h3>
          <div>
            <label>Type</label>
            <select name="type" onChange={this.onChange}>
              <option value="">- Please select -</option>
              <option value="Interview">Interview</option>
              <option value="Meeting">Meeting</option>
            </select>
          </div>
          <div>
            <label>Select a day:</label>
            <select name="day" onChange={this.onChange}>
              {this.props.daysAvailable.map((d) => <option value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label>From:</label>
            <input name="from" type="number" min="0" max="24" onChange={this.onChange}></input>
          </div>
          <div>
            <label>To:</label>
            <input name="to" type="number" min="0" max="24" onChange={this.onChange}></input>
          </div>
          <button onClick={this.addTimeslot} type="button">Confirm</button>
        </form>
      </div>
    );
  }
}
export default FormContainer;

const date = new Date();
const daysAvailable = ['- Please select -'];
const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
for (let i = date.getDate(); i <= days; i++) {
  daysAvailable.push(i);
}
const wrapper = document.getElementById("list-timeslots");
wrapper ? ReactDOM.render(<FormContainer daysAvailable={daysAvailable}/>, wrapper) : false;
