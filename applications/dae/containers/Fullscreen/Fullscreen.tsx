import "./Fullscreen.scss";

import {ReactNode} from "react";

import FullscreenBackground from "./FullscreenBackground";
import {StaticImageData} from "next/image";

type FullscreenProps = {
  children?: ReactNode;
  background?: StaticImageData;
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
