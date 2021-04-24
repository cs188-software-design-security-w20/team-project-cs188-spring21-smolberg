/** @jsxImportSource theme-ui */

import { ThemeProvider } from '@theme-ui/theme-provider'
import React, { useEffect } from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import PrivateRoute from './routes/PrivateRoute'
// import { useCookies } from 'react-cookie';

import theme from './styles'

const App = () => {

  // const [cookies, setCookie] = useCookies(['user']);
  // let authorized = true;

  useEffect(() => {
    document.title = "Smolberg";
  }, [])
  // useEffect(() => {
  //   // if(authorized && cookies["user"] === "undefined") {
  //   //   console.log('making cookie');
  //   //   setCookie('user', 'pw', {path: '/'})
  //   // } else if (!authorized && cookies["user"] !== "undefined"){
  //   //   console.log(cookies["user"]);
  //   // }
  //   console.log("before");
  //   setCookie('user', 'pw', {path: '/'});
  //   console.log(cookies);
  // }, [authorized, cookies, setCookie])

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AuthContext>
          <Switch>
            {/* Example of a regular route */}
            <Route exact path="/" component={LandingPage} />
            {/* Example of a private route w/ redirects to /login if not a approved page/user */}
            <PrivateRoute exact path="/files" component={LandingPage} />
          </Switch>
        </AuthContext>
      </ThemeProvider>
    </Router>
  )
}

export default App
