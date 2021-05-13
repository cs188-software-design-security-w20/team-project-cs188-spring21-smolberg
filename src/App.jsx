/** @jsxImportSource theme-ui */

import { ThemeProvider } from "@theme-ui/theme-provider";
import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import constants from "./constants";
import { AuthProvider } from "./contexts/AuthContext";
import { DriveProvider } from "./contexts/DriveContext";
import { favicon } from "./lib/misc";
import Files from "./pages/Files";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./routes/PrivateRoute";

import theme from "./styles";

const App = () => {
  useEffect(() => {
    document.title = constants.APP_NAME;
    favicon.changeFavicon("locked.png");
  }, []);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <DriveProvider>
            <Switch>
              {/* Example of a regular route */}
              <Route exact path="/" component={LandingPage} />
              <Route exact path="/login" component={Login} />
              {/* Example of a private route w/ redirects to /login if not a approved page/user */}
              <PrivateRoute exact path="/files" component={Files} />
              <Route component={NotFound} />
            </Switch>
          </DriveProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
