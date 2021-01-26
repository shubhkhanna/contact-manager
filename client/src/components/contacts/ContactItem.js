import { useContext } from "react";
import ContactContext from "../../context/contact/contactContext";

const ContactItem = ({ contact }) => {
  const contactContext = useContext(ContactContext);

  const { deleteContact, setCurrent, clearCurrent } = contactContext;

  const { _id, name, type, email, phone } = contact;

  const onDelete = () => {
    deleteContact(_id);
    clearCurrent();
  };

  return (
    <div className="card bg-light">
      <h3 className="text-primary text-left">
        {name}
        {type && (
          <span
            className={
              "badge text-right " +
              (type === "professional" ? "badge-success" : "badge-primary")
            }>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        )}
      </h3>
      <h3 className="text-dark text-left">{email}</h3>
      <h3 className="text-dark text-left">{phone}</h3>
      <p>
        <button
          className="btn btn-dark btn-sm"
          onClick={() => setCurrent(contact)}>
          Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          Delete
        </button>
      </p>
    </div>
  );
};

export default ContactItem;
