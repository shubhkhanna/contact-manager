import { useContext } from "react";
import { route, Redirect, Route } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);

  const { isAuth, loading } = authContext;

  return (
    <Route
      {...rest}
      render={props =>
        !isAuth && !loading ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
