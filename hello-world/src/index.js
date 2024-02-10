import App from "./Hello"
import React from 'react'
import ReactDOM from "react-dom";
import store from './app/store'
import { Provider } from 'react-redux'
import {Counter} from "./features/keyController/keyController"
import { Chameleon as ChameleonIntro } from "./Chameleon";

ReactDOM.hydrate(
    <Provider store={store}>
        <div>
            <Counter>
                <App store={store}/>
            </Counter>   
             <ChameleonIntro />
        </div>
    </Provider>,
    document.getElementById('root')
)

// Enable Webpack HMR for the component
// if (module.hot) {
//     module.hot.accept('./', () => {
//         const NextApp = require('./').default;
//         render(NextApp);
//     });
// }