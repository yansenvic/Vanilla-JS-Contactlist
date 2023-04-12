let state = {
  hash: location.hash,
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

function setState(newState) {
  const prevState = { ...state };
  const nextState = { ...state, ...newState };
  state = nextState;
  onStateChange(prevState, nextState);
  Render();
}

let timer;

function onStateChange(prevState, nextState) {
  if (prevState.hash !== nextState.hash) {
    history.pushState(null, "", nextState.hash);
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
  link.href = props.href;
  link.textContent = props.label;
  link.onclick = function (event) {
    event.preventDefault();
    const url = new URL(event.target.href);
    setState({ hash: url.hash });
  };
  return link;
}

function NavBar() {
  const linkHome = Link({
    href: "#home",
    label: "Home",
  });
  const linkFavorites = Link({
    href: "#favorites",
    label: "Favorites",
  });
  const div = document.createElement("div");
  div.append(linkHome);
  div.append(" - ");
  div.append(linkFavorites);
  return div;
}

function Pages(props) {
  const totalPage = Math.ceil(props.totalData / 10);
  let div = document.createElement("div");
  for (let index = 1; index <= totalPage; index++) {
    const link = document.createElement("a");
    const number = index;
    link.href = state.hash;
    link.textContent = index + " ";
    link.onclick = function () {
      event.preventDefault();
      props.onChange(number);
    };
    div.append(link);
  }
  return div;
}

function HeaderText(text) {
  const teks = document.createElement("h2");
  teks.innerText = text;
  return teks;
}

function inputText(props) {
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

function Button(props) {
  const button = document.createElement("input");
  button.type = "button";
  button.value = props.value;
  button.onclick = props.func;
  return button;
}

function ClearSearchValue() {
  setState({ searchValue: "" });
}

function ClearSearchValueFavorite() {
  setState({ searchValueFavorite: "" });
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

function filterFavContactslist() {
  const limit = 10;
  const items = state.favContacts.filter(filterName);
  return [
    ...items.slice(
      (state.currentPageFavorite - 1) * limit,
      state.currentPageFavorite * limit
    ),
  ];
}

function filterName(item) {
  const fullname = (
    item.firstName +
    " " +
    item.maidenName +
    " " +
    item.lastName
  ).toLowerCase();
  return fullname.match(state.searchValueFavorite.toLowerCase());
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

function ContactList(props) {
  const limit = 10;
  const list = document.createElement("ol");
  list.start = (props.currentPage - 1) * limit + 1;
  data = props.data;
  const items = data.map((contact) => {
    const li = document.createElement("li");
    const fullname = document.createElement("p");
    const email = document.createElement("p");
    const buttonStatus = state.favContacts.some((favContact) => {
      return contact.id === favContact.id;
    });
    button = Button({
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

function HomePage() {
  const navBar = NavBar();
  const header = HeaderText("Contact List");
  const input = inputText({
    value: state.searchValue,
    onInput: function (searchValues) {
      setState({ searchValue: searchValues });
    },
  });
  const button = Button({
    value: "Clear",
    func: ClearSearchValue,
  });
  const list = ContactList({
    currentPage: state.currentPage,
    data: state.contacts,
  });
  const page = Pages({
    totalData: state.totalData,
    onChange: function (number) {
      setState({ currentPage: number });
    },
  });
  const div = document.createElement("div");
  div.append(navBar, header, input, button);
  if (state.isLoading) {
    const loadingText = document.createElement("p");
    loadingText.textContent = "Data is Loading";
    div.append(loadingText);
  } else if (state.errorMassage !== "") {
    const errorText = document.createElement("p");
    errorText.textContent = state.errorMassage;
    div.append(errorText);
  } else if (state.totalData > 0) {
    div.append(list, page);
  } else {
    const emptyText = document.createElement("p");
    emptyText.textContent = "Data empty";
    div.append(emptyText);
  }
  return div;
}

function FavoritesPage() {
  const filterData = filterFavContactslist();
  const navBar = NavBar();
  const header = HeaderText("Favorite Contact List");
  const input = inputText({
    value: state.searchValueFavorite,
    onInput: function (searchValues) {
      setState({ searchValueFavorite: searchValues });
    },
  });
  const button = Button({
    value: "Clear",
    func: ClearSearchValueFavorite,
  });
  const list = ContactList({
    currentPage: state.currentPageFavorite,
    data: filterData,
  });
  const page = Pages({
    totalData: state.favContacts.filter(filterName).length,
    onChange: function (number) {
      setState({ currentPageFavorite: number });
    },
  });
  const div = document.createElement("div");
  div.append(navBar, header, input, button);
  if (filterFavContactslist().length > 0) {
    div.append(list, page);
  } else {
    const emptyText = document.createElement("p");
    emptyText.textContent = "Data empty";
    div.append(emptyText);
  }
  return div;
}

function App() {
  const homepage = HomePage();
  const favoritespage = FavoritesPage();
  if (state.hash === "#home" || state.hash === "") {
    return homepage;
  } else if (state.hash === "#favorites") {
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
