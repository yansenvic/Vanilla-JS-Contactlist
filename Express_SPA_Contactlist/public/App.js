import { HomePage } from "../component/HomePage.js";
import { FavoritesPage } from "../component/FavoritesPage.js";
import { state } from "./state.js";

export function App() {
  const homepage = HomePage();
  const favoritespage = FavoritesPage();
  if (state.path === "/home" || state.path === "/") {
    return homepage;
  } else if (state.path === "/favorites") {
    return favoritespage;
  }
}
