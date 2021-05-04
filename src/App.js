/** @jsxImportSource theme-ui */

import { ThemeProvider } from '@theme-ui/theme-provider'
import React, { useEffect } from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Files from './pages/Files'
import LandingPage from './pages/LandingPage'
import PrivateRoute from './routes/PrivateRoute'

import theme from './styles'

const App = () => {

  useEffect(() => {
    document.title = "Smolberg"
  }, [])

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Switch>
            {/* Example of a regular route */}
            <Route exact path="/" component={LandingPage} />
            {/* Example of a private route w/ redirects to /login if not a approved page/user */}
            <PrivateRoute exact path="/files" component={Files} />
          </Switch>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
