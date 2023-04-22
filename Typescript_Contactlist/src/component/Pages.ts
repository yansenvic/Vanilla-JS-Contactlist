import { state } from "../public/state.js";

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
