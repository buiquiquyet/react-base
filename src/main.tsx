import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/reducer/store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>,
);
