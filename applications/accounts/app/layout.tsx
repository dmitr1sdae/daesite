import "./global.scss";

import {Icons} from "@daesite/components";
import {ReactNode} from "react";

import {StoreProvider} from "./store";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({children}: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <Icons />
        <StoreProvider>{children}</StoreProvider>
        <div
          id="__portalRoot"
          style={{position: "absolute", top: "0", left: "0"}}
        />
      </body>
    </html>
  );
};

export default RootLayout;
