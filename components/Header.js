import Link from 'next/link'
import Head from 'next/head'

const linkStyle = {
  marginRight: 15
}

const Header = () => (
    <div>
      <Head>
        <title>spotnik</title>
        <meta charset='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link rel="icon" type="image/png" href="../static/favicon.png" />
      </Head>
      <h1>spotnik</h1>
      <Link prefetch href="/">
        <a style={linkStyle}>home</a>
      </Link>
      <Link prefetch href="/configuration">
        <a style={linkStyle}>configuration</a>
      </Link>
      <Link prefetch href="/admin">
        <a style={linkStyle}>admin</a>
      </Link>
      <Link prefetch href="/about">
        <a style={linkStyle}>about</a>
      </Link>
      <hr/>
    </div>
)

export default Header
