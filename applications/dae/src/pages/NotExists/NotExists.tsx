import {EpicTitle} from "@components";
import {Link} from "react-router-dom";

const NotExists = () => {
  return (
    <>
      <Link to="/">
        <EpicTitle>NOT EXISTS</EpicTitle>
      </Link>
    </>
  );
};

export default NotExists;
