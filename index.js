let state = {
  hash: location.hash,
  contacts: [],
  searchValue: "",
};

function SetState(newState) {
  const prevState = { ...state };
  const nextState = { ...state, ...newState };
  state = nextState;
  OnStateChange(prevState, nextState);
  Render();
}

function OnStateChange(prevState, nextState) {
  if (prevState.hash !== nextState.hash) {
    history.pushState(null, "", nextState.hash);
  }
  if (prevState.searchValue !== nextState.searchValue) {
    FetchData();
  }
}

function Link(props) {
  const link = document.createElement("a");
  let a = state.data + 1;
  link.href = props.href;
  link.textContent = props.label;
  link.onclick = function (event) {
    event.preventDefault();
    const url = new URL(event.target.href);
    SetState({ hash: url.hash, searchValue: "" });
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

function HeaderText(text) {
  const teks = document.createElement("h2");
  teks.innerText = text;
  return teks;
}

function inputtext() {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter Name";
  input.id = "input";
  input.value = state.searchValue;
  input.oninput = function (event) {
    SetState({ searchValue: event.target.value });
  };
  return input;
}

function clearbutton(props) {
  const button = document.createElement("input");
  button.type = "button";
  button.value = props.value;
  button.onclick = function () {
    SetState({ searchValue: "" });
  };
  return button;
}

function printlist() {
  const list = document.createElement("dl");
  const dt = document.createElement("dt");
  const dd1 = document.createElement("dd");
  const dd2 = document.createElement("dd");
  const dd3 = document.createElement("dd");
  dt.textContent = "1";
  dd1.textContent = "Nama";
  dd2.textContent = "email";
  dd3.textContent = "button";
  dt.append(dd1);
  dt.append(dd2);
  dt.append(dd3);
  list.append(dt);
  return list;
}

function FetchData() {
  fetch("https://dummyjson.com/users/search?q=&skip=0&limit=10").then(
    (result) =>
      result.json().then((data) => {
        SetState({ contacts: [...data.users] });
      })
  );
}

function HomePage() {
  const navBar = NavBar();
  const header = HeaderText("Contact List");
  const input = inputtext();
  const button = clearbutton({
    value: "Clear",
  });
  const list = printlist();
  const list2 = printlist();
  const div = document.createElement("div");
  div.append(navBar);
  div.append(header);
  div.append(input);
  div.append(button);
  div.append(list);
  div.append(list2);
  return div;
}

function FavoritesPage() {
  const navBar = NavBar();
  const header = HeaderText("Favorite Contact List");
  const input = inputtext();
  const button = clearbutton({
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
  if (state.hash === "#home") {
    return homepage;
  } else if (state.hash === "#favorites") {
    return favoritespage;
  }
}

function Render() {
  const root = document.getElementById("root");
  const app = App();
  const focusedIdElement = document.activeElement.id;
  const focusedElementSelectionStart = document.activeElement.selectionStart;
  const focusedElementSelectionEnd = document.activeElement.selectionEnd;
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
