import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Register from "./components/auth/Register";
import Header from "./components/layout/Header";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import AuthState from "./context/auth/AuthState";
import ContactState from "./context/contact/contactState";
import AlertState from "./context/alert/AlertState";
import Alerts from "./components/layout/Alerts";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./components/auth/PrivateRoute";

// Checking user already exists
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  return (
    <AuthState>
      <ContactState>
        <AlertState>
          <Router>
            <Header />
            <div className="container">
              <Alerts />
              <Switch>
                <PrivateRoute exact path="/" component={Home} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
              </Switch>
            </div>
          </Router>
        </AlertState>
      </ContactState>
    </AuthState>
  );
};

export default App;
