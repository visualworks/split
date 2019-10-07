require("const.json");
import "scss/style.scss";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import React from "react";
import ReactDOM from "react-dom";
import Layout from "components/layout";

const layout = (<Layout />);
const targetDiv = document.getElementById("app");
ReactDOM.render(layout, targetDiv);