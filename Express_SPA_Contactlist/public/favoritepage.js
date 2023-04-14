import { NavBar, HeaderText, inputText, Button } from "./index.js";
import { ContactList, Pages, state, setState } from "./index.js";

export function FavoritesPage() {
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

function ClearSearchValueFavorite() {
  setState({ searchValueFavorite: "" });
}
