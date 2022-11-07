import App from "./Hello"
import React from 'react'
import ReactDOM from "react-dom";

ReactDOM.hydrate(
    <App />,
    document.getElementById('root')
)
