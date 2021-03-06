import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "./store/index";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import { setupInterceptors } from "./_helpers/interceptors";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const finalStore = createStoreWithMiddleware(
  store,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

setupInterceptors(finalStore);

ReactDOM.render(
  <Provider store={finalStore}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
