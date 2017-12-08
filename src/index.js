const WEBSERVICE = require("const.json");
require("css/style.scss");

import React, {Component} from "react";
import ReactDOM from "react-dom";
import Layout from "layout";

const layout = <Layout />;
ReactDOM.render(
    layout,
    document.getElementById("app")
);