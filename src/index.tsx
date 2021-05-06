import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { CssBaseline, GeistProvider, Themes } from '@geist-ui/react'
import GlobalStyle from './style/Global'
import App from './pages/App'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import Providers from './Providers'
import 'inter-ui'
import './i18n'

if ('ethereum' in window) {
  (window.ethereum as any).autoRefreshOnNetworkChange = false
}

window.addEventListener('error', () => {
  localStorage?.removeItem('redux_localstorage_simple_lists')
})

const myTheme1 = Themes.createFromLight({
  type: 'viralata',
  font: {
    sans:
      '"Source Sans Pro", sans-serif',
    mono: 'Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace',
  },
})

ReactDOM.render(
  <StrictMode>
    <Providers>
      <>
        <ListsUpdater />
        <ApplicationUpdater />
        <TransactionUpdater />
        <MulticallUpdater />
      </>
      <GlobalStyle />
      <GeistProvider themes={[myTheme1]} themeType="viralata">
        <CssBaseline />
        <App />
      </GeistProvider>
    </Providers>
  </StrictMode>,
  document.getElementById('root')
)
