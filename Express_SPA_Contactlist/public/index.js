import { HomePage } from "./homepage.js";
import { FavoritesPage } from "./favoritepage.js";

export let state = {
  path: window.location.pathname,
  contacts: [],
  favContacts: JSON.parse(localStorage.getItem("favContacts")) ?? [],
  searchValue: "",
  searchValueFavorite: "",
  currentPage: 1,
  currentPageFavorite: 1,
  isLoading: false,
  errorMassage: "",
  totalData: 0,
};

export function setState(newState) {
  const prevState = { ...state };
  const nextState = { ...state, ...newState };
  state = nextState;
  onStateChange(prevState, nextState);
  Render();
}

let timer;

function onStateChange(prevState, nextState) {
  if (prevState.path !== nextState.path) {
    history.pushState(null, "", nextState.path);
  }
  if (prevState.searchValue !== nextState.searchValue) {
    setState({ isLoading: true });
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fetchData();
      setState({ isLoading: false, currentPage: 1 });
    }, 500);
  }
  if (prevState.searchValueFavorite !== nextState.searchValueFavorite) {
    setState({ currentPageFavorite: 1 });
  }
  if (prevState.currentPage !== nextState.currentPage) {
    fetchData();
  }
  if (prevState.favContacts !== nextState.favContacts) {
    localStorage.setItem("favContacts", JSON.stringify(nextState.favContacts));
  }
}

function Link(props) {
  const link = document.createElement("a");
  link.href = props.pathname;
  link.textContent = props.label;
  link.onclick = function (event) {
    event.preventDefault();
    setState({ path: new URL(event.target.href).pathname });
  };
  return link;
}

export function NavBar() {
  const linkHome = Link({
    pathname: "/home",
    label: "Home",
  });
  const linkFavorites = Link({
    pathname: "/favorites",
    label: "Favorites",
  });
  const div = document.createElement("div");
  div.append(linkHome);
  div.append(" - ");
  div.append(linkFavorites);
  return div;
}

export function Pages(props) {
  const totalPage = Math.ceil(props.totalData / 10);
  let div = document.createElement("div");
  for (let index = 1; index <= totalPage; index++) {
    const link = document.createElement("a");
    const number = index;
    link.href = state.path;
    link.textContent = index + " ";
    link.onclick = function (event) {
      event.preventDefault();
      props.onChange(number);
    };
    div.append(link);
  }
  return div;
}

export function HeaderText(text) {
  const teks = document.createElement("h2");
  teks.innerText = text;
  return teks;
}

export function inputText(props) {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter Name";
  input.id = "input";
  input.value = props.value;
  input.oninput = function (event) {
    props.onInput(event.target.value);
  };
  return input;
}

export function Button(props) {
  const button = document.createElement("input");
  button.type = "button";
  button.value = props.value;
  button.onclick = props.func;
  return button;
}

function addFav(id) {
  setState({
    favContacts: [...state.favContacts, state.contacts[(id - 1) % 10]],
  });
}

function delFav(id) {
  const result = state.favContacts.filter(filterid);
  function filterid(data) {
    return data.id !== Number(id);
  }
  setState({
    favContacts: result,
  });
}

function fetchData() {
  const limit = 10;
  const skip = (state.currentPage - 1) * limit;
  fetch(
    `https://dummyjson.com/users/search?q=${state.searchValue}&skip=${skip}&limit=${limit}`
  )
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      setState({
        contacts: [...data.users],
        totalData: data.total,
        errorMassage: "",
      });
    })
    .catch((err) => {
      setState({ contacts: [], errorMassage: err.message, totalData: 0 });
    })
    .finally(() => setState({ isLoading: false }));
}

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
      func: buttonStatus ? () => delFav(contact.id) : () => addFav(contact.id),
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

function App() {
  const homepage = HomePage();
  const favoritespage = FavoritesPage();
  if (state.path === "/home" || state.path === "/") {
    return homepage;
  } else if (state.path === "/favorites") {
    return favoritespage;
  }
}

function Render() {
  const root = document.getElementById("root");
  const app = App();
  let focusedIdElement;
  let focusedElementSelectionStart;
  let focusedElementSelectionEnd;
  if (document.activeElement.type === "text") {
    focusedIdElement = document.activeElement.id;
    focusedElementSelectionStart = document.activeElement.selectionStart;
    focusedElementSelectionEnd = document.activeElement.selectionEnd;
  }
  root.innerHTML = "";
  root.append(app);
  if (focusedIdElement) {
    const focusedElement = document.getElementById(focusedIdElement);
    focusedElement.focus();
    focusedElement.selectionStart = focusedElementSelectionStart;
    focusedElement.selectionEnd = focusedElementSelectionEnd;
  }
}

Render();
onStateChange({}, state);
