import { ReactElement } from "react";
import ReactDOM from "react-dom";

export function openModal(com: ReactElement) {
    let el = document.getElementById("dp-modal");
    if (!el) {
        el = document.createElement("div");
        el.setAttribute("id", "dp-modal")
        document.body.appendChild(el)
    }
    ReactDOM.render(com, el);
}

export function destroyModal() {
    let el = document.getElementById("dp-modal");
    if (el) ReactDOM.unmountComponentAtNode(el);

}