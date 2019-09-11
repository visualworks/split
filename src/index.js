require("const.json");
import "scss/style.scss";
import React from "react";
import ReactDOM from "react-dom";
import Layout from "components/layout";

const layout = (<Layout />);
const targetDiv = document.getElementById("app");
ReactDOM.render(layout, targetDiv);