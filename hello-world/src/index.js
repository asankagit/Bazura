import App from "./Hello"
import React from 'react'
import ReactDOM from "react-dom";
import ReactDom from "react-dom";

ReactDom.hydrate(
    <App />,
    document.getElementById('react-root')
)
