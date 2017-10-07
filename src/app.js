import React from "react";
import ReactDOM from "react-dom";
import Layout from "./layout";

require("./css/style.scss");

const layout = <Layout />;

ReactDOM.render(
    layout,
    document.getElementById("app")
);