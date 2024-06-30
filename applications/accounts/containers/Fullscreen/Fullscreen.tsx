import "./Fullscreen.scss";

import {ReactNode} from "react";

import FullscreenBackground from "./FullscreenBackground";

export interface FullscreenProps {
  children?: ReactNode;
  background?: string;
};

const Fullscreen = ({children, background}: FullscreenProps) => {
  return (
    <section className="fullscreen">
      {background && <FullscreenBackground src={background} />}
      <div className="fullscreen_body">{children}</div>
    </section>
  );
};

export default Fullscreen;
