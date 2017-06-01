import Layout from '../components/Layout'
import React from 'react'

class Component extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {}
  }

  handleSubmit(event) {
    event.preventDefault()
    fetch('/dtmf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/text'
      },
      body: event.target.elements.dtmf.value
    })
  }

  render() {
    return (
      <Layout>
        <form onSubmit={this.handleSubmit}>
          <input name="dtmf" type="text"/>
          <input type="submit"/>
        </form>
      </Layout>
    )
  }
}

export default Component
