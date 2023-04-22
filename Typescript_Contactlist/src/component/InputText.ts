export function InputText(props) {
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
