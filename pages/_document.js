import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="description" content="Ahorrai - Financial Management App" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <script 
          type="module" 
          src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fahorrai3074back.builtwithrocket.new&_be=https%3A%2F%2Fapplication.rocket.new&_v=0.1.5"
        />
      </Head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div className="dhiwise-code" id="root">
          <Main />
        </div>
        <NextScript />
      </body>
    </Html>
  )
} 