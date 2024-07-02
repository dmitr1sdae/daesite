import "@daesite/components/style";
import "./global.scss";
import {Icons} from "@daesite/components";
import {ReactNode} from "react";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({children}: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <Icons />
        {children}
        <div
          id="__portalRoot"
          style={{position: "absolute", top: "0", left: "0"}}
        />
      </body>
    </html>
  );
};

export default RootLayout;
