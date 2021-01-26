import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import ContactContext from "../../context/contact/contactContext";

const Header = () => {
  const authContext = useContext(AuthContext);
  const contactContext = useContext(ContactContext);

  const { isAuth, logoutUser, user } = authContext;
  const { clearContacts } = contactContext;

  const onClick = () => {
    logoutUser();
    clearContacts();
  };

  const authLinks = (
    <>
      <li>hello {user && user.name}</li>
      <li>
        <a onClick={onClick} href="#!">
          <i className="fas fa-sign-out-alt" /> Logout
        </a>
      </li>
    </>
  );

  return (
    <div className="navbar bg-primary">
      <h1>
        <i className="fas fa-id-card-alt" />
        Contact Manager
      </h1>
      <ul>
        {isAuth ? (
          authLinks
        ) : (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Header;
