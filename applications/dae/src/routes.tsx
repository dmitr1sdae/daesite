import {RouteObject} from "react-router-dom";
import {App} from "./app";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [],
  },
  {
    path: "*",
    element: <>NOT EXISTS</>,
  },
];
