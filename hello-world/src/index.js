import App from "./Hello"
import React from 'react'
import ReactDOM from "react-dom";

ReactDOM.hydrate(
    <App />,
    document.getElementById('root')
)

// Enable Webpack HMR for the component
// if (module.hot) {
//     module.hot.accept('./', () => {
//         const NextApp = require('./').default;
//         render(NextApp);
//     });
// }