import {RouteObject} from "react-router-dom";
import {App} from "./app";
import {Home, HomeLoader} from "@pages/Home";
import {NotExists} from "@pages/NotExists";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: HomeLoader,
      },
    ],
  },
  {
    path: "*",
    element: <NotExists />,
  },
];
