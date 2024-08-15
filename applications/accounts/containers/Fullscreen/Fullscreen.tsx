import { clsx } from "@daesite/utils";
import "./Fullscreen.scss";

import {HTMLProps, ReactNode} from "react";

export interface FullscreenProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  background?: () => JSX.Element;
}

const Fullscreen = ({
  children,
  className,
  background: Background
}: FullscreenProps) => {
  return (
    <section className={clsx("fullscreen", className)}>
      {Background && <Background />}
      <div className="fullscreen_body">{children}</div>
    </section>
  );
};

export {Fullscreen};
