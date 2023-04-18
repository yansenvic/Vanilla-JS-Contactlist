import { App } from "./public/App.js";
import { onStateChange, state } from "./public/state.js";

export function Render() {
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
