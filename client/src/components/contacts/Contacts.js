import { useContext, useEffect } from "react";
import ContactContext from "../../context/contact/contactContext";
import ContactItem from "./ContactItem";
import Spinner from "../layout/Spinner";

const Contacts = () => {
  const contactContext = useContext(ContactContext);

  const { contacts, filtered, getContacts, loading } = contactContext;

  useEffect(() => {
    getContacts();
    // eslint-disable-next-line
  }, []);

  if (contacts !== null && contacts.length === 0 && !loading) {
    return <h4 className="text-center my-3">Please Add a Contact!</h4>;
  }

  return (
    <>
      {contacts !== null && !loading ? (
        <>
          {filtered !== null
            ? filtered.map(contact => (
                <ContactItem contact={contact} key={contact._id} />
              ))
            : contacts.map(contact => (
                <ContactItem contact={contact} key={contact._id} />
              ))}
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Contacts;
