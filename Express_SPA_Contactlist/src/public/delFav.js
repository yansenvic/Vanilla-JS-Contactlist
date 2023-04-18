import { state, setState } from "./state.js";

export function delFav(id) {
  const result = state.favContacts.filter(filterid);
  function filterid(data) {
    return data.id !== Number(id);
  }
  setState({
    favContacts: result,
  });
}
