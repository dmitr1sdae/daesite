import {createRoot} from "react-dom/client";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import {routes} from "./routes";

createRoot(document.getElementById("app")!).render(
  <RouterProvider
    router={createBrowserRouter(routes)}
    fallbackElement={<>LOADING...</>}
  />,
);
