import {EpicTitle} from "@components/EpicTitle";
import {AppLink} from "@daesite/components";
import {Metadata} from "next/types";

export const metadata: Metadata = {
  title: "Page Not Found | dadaya",
};

const NotExists = () => {
  return (
    <AppLink to="/">
      <EpicTitle>NOT EXISTS</EpicTitle>
    </AppLink>
  );
};

export default NotExists;
