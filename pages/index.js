import Layout from '../components/Layout'
import fetch from 'isomorphic-fetch'

// https://github.com/zeit/next.js/issues/2069
// import api from '../lib/api'
// const isServer = typeof window === 'undefined'
// const get = isServer
//   ? (id) => api.get(id)
//   : (id) => fetch(`http://localhost:3000/api/${id}`).then(res => res.text())
function get (id) {
  return fetch(`http://localhost:3000/api/${id}`).then(res => res.text())
}

const Index = (props) => (
  <Layout>
    <div>
      <p>uptime: {props.uptime}</p>
      <p>hostname: {props.hostname}</p>
      <p>memory: {props.memory}</p>
      <p>cpu: {props.cpu}</p>
      <p>ip: {props.ip}</p>
      <p>time: {props.datetime}</p>
      <p>version: {props.version}</p>
      <p>network: {props.network}</p>
    </div>
  </Layout>
)

Index.getInitialProps = async function () {
  return {
    uptime: await get('uptime'),
    hostname: await get('hostname'),
    memory: await get('memory'),
    cpu: await get('cpu'),
    ip: await get('ip'),
    datetime: await get('datetime'),
    version: await get('version'),
    network: await get('network'),
  }
}

export default Index
