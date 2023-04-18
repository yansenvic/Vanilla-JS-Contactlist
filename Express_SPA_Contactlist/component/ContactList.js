import { state, setState } from "../state.js";
import { Button } from "./Button.js";
import { delFav } from "../delFav.js";

export function ContactList(props) {
  const limit = 10;
  const list = document.createElement("ol");
  list.start = (props.currentPage - 1) * limit + 1;
  const data = props.data;
  const items = data.map((contact) => {
    const li = document.createElement("li");
    const fullname = document.createElement("p");
    const email = document.createElement("p");
    const buttonStatus = state.favContacts.some((favContact) => {
      return contact.id === favContact.id;
    });
    const button = Button({
      value: buttonStatus ? "Delete from Favorite" : "Add to Favorite",
      onClick: buttonStatus
        ? () => delFav(contact.id)
        : () => {
            setState({
              favContacts: [
                ...state.favContacts,
                state.contacts[(contact.id - 1) % 10],
              ],
            });
          },
    });
    fullname.textContent =
      contact.firstName + " " + contact.maidenName + " " + contact.lastName;
    email.textContent = contact.email;
    li.append(fullname, email, button);
    return li;
  });
  list.append(...items);
  return list;
}
