import {EpicTitle} from "@components/EpicTitle";
import {AppLink} from "@daesite/components";

const NotExists = () => {
  return (
    <AppLink to="/">
      <EpicTitle>NOT EXISTS</EpicTitle>
    </AppLink>
  );
};

export default NotExists;
