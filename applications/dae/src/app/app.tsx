import {Outlet} from "react-router-dom";
import {Icons} from "@daesite/components";
import "./app.scss";

const App = () => {
  return (
    <>
      <Icons />
      <Outlet />
    </>
  );
};

export default App;
