import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'

import { Main } from '~/index'

const rootEl = document.getElementById('root')!
if (!rootEl.innerHTML) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <StrictMode>
      <Main />
    </StrictMode>,
  )
}
