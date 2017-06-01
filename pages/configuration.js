import Layout from '../components/Layout'
import fetch from 'isomorphic-fetch'
import React from 'react'

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static getInitialProps () {
    return fetch(`http://localhost:3000/config`).then(res => res.json())
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {

    alert('An essay was submitted: ' + this.props.callsign);
    event.preventDefault();
  }

  render() {
    return (
      <Layout>
        <form onSubmit={this.handleSubmit}>
          <label>
            callsign:
            <input type="text" name="callsign" value={this.props.callsign} />
          </label>
          <input type="submit" value="Save" />
        </form>
      </Layout>
    )
  }
}

export default Component
