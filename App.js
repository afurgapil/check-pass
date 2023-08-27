import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/store/index";
import Main from "./src/Main";
import "react-native-gesture-handler";
const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};
export default App;
