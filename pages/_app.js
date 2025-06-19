import '../src/styles/tailwind.css'
import '../src/styles/index.css'
import { Provider } from 'react-redux'
import { store } from '../src/store/store'
import ErrorBoundary from '../src/components/ErrorBoundary'

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </Provider>
  )
}

export default MyApp 