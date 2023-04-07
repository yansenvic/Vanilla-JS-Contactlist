let state = {
  hash: location.hash,
  contacts: [],
  favContacs: JSON.parse(localStorage.getItem("favContacts")) ?? [],
  searchValue: "",
  currentPage: 1,
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
    setState({ searchValue: "" });
  }
  if (prevState.searchValue !== nextState.searchValue) {
    setState({ isLoading: true });
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fetchData();
    }, 500);
  }
  if (prevState.currentPage !== nextState.currentPage) {
    fetchData();
  }
  if (prevState.favContacs !== nextState.favContacs) {
    localStorage.setItem("favContacts", JSON.stringify(nextState.favContacs));
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

function Pages() {
  const totalPage = Math.ceil(state.totalData / 10);
  let div = document.createElement("div");
  for (let index = 1; index <= totalPage; index++) {
    const link = document.createElement("a");
    const number = index;
    link.href = state.hash;
    link.textContent = index + " ";
    link.onclick = function (event) {
      event.preventDefault();
      setState({ currentPage: number });
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

function InputText() {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter Name";
  input.id = "input";
  input.value = state.searchValue;
  input.oninput = function (event) {
    setState({ searchValue: event.target.value });
  };
  return input;
}

function ClearButton(props) {
  const button = document.createElement("input");
  button.type = "button";
  button.value = props;
  button.value = props.value;
  button.onclick = function () {
    setState({ searchValue: "" });
  };
  return button;
}

function Button(props) {
  const button = document.createElement("input");
  button.type = "button";
  button.value = props.value;
  button.id = props.id;
  button.onclick = props.func;
  return button;
}

function addFav(event) {
  setState({
    favContacs: [
      ...state.favContacs,
      state.contacts[(event.target.id - 1) % 10],
    ],
  });
}

function delFav(event) {
  const result = state.favContacs.filter(filterid);
  function filterid(data) {
    return data.id !== Number(event.target.id);
  }
  setState({
    favContacs: [...result],
  });
}

function ContactList() {
  const list = document.createElement("ol");
  list.start = (state.currentPage - 1) * 10 + 1;
  const items = state.contacts.map((data) => {
    const li = document.createElement("li");
    const fullname = document.createElement("p");
    const email = document.createElement("p");
    let i = 0;
    let findSame = false;
    do {
      if (JSON.stringify(data) === JSON.stringify(state.favContacs[i])) {
        findSame = true;
      }
      i++;
    } while (i < state.favContacs.length && findSame === false);
    let button;
    if (findSame === false) {
      button = Button({
        value: "Add to Favorite",
        func: addFav,
        id: data.id,
      });
    } else {
      button = Button({
        value: "Delete from Favorite",
        func: delFav,
        id: data.id,
      });
    }
    fullname.textContent =
      data.firstName + " " + data.maidenName + " " + data.lastName;
    email.textContent = data.email;
    li.append(fullname, email, button);
    return li;
  });
  list.append(...items);
  return list;
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

function HomePage() {
  const navBar = NavBar();
  const header = HeaderText("Contact List");
  const input = InputText();
  const button = ClearButton({
    value: "Clear",
  });
  const list = ContactList();
  const page = Pages();
  const div = document.createElement("div");
  div.append(navBar);
  div.append(header);
  div.append(input);
  div.append(button);
  if (state.isLoading) {
    const loadingText = document.createElement("p");
    loadingText.textContent = "Data is Loading";
    div.append(loadingText);
  } else if (state.errorMassage !== "") {
    const errorText = document.createElement("p");
    errorText.textContent = state.errorMassage;
    div.append(errorText);
  } else if (state.totalData > 0) {
    div.append(list);
    div.append(page);
  } else {
    const emptyText = document.createElement("p");
    emptyText.textContent = "Data empty";
    div.append(emptyText);
  }
  return div;
}

function FavoritesPage() {
  const navBar = NavBar();
  const header = HeaderText("Favorite Contact List");
  const input = InputText();
  const button = ClearButton({
    value: "Clear",
  });
  const div = document.createElement("div");
  div.append(navBar);
  div.append(header);
  div.append(input);
  div.append(button);
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
