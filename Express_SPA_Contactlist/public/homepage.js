import { NavBar, HeaderText, inputText, Button } from "./index.js";
import { ContactList, Pages, state, setState } from "./index.js";

export function HomePage() {
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

function ClearSearchValue() {
  setState({ searchValue: "" });
}
