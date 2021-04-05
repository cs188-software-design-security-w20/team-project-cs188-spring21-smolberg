/** @jsxImportSource theme-ui */

import { ThemeProvider } from '@theme-ui/theme-provider'
import React, { useEffect } from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

import theme from './theme'

 const App = () => {

  useEffect(() => {
    document.title = "Swollberg"
  }, [])

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/" component={LandingPage} />
        </Switch>
      </ThemeProvider>
    </Router>
  )
}

export default App
