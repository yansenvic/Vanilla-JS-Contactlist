import { Link } from "./Link.js";

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
