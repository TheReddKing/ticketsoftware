import React from "react";
import "./App.css";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";
import AppHeader from "./AppHeader";
import LandingPage from "./components/LandingPage";
import LoginCallback from "./components/LoginCallback";

const App: React.FC = () => {
  document.title = process.env.REACT_APP_NAME || "";
  return (
    <Router>
      <CookiesProvider>
        <div className="App">
          <AppHeader />
          <Switch>
            <Route exact path="/login/auth" component={LoginCallback} />
            <Route path="/" component={LandingPage} />
          </Switch>
        </div>
      </CookiesProvider>
      <Alert stack={{ limit: 3 }} />
    </Router>
  );
};

export default App;
