import "./EpicTitle.scss";

import {HTMLProps, ReactNode} from "react";

export interface EpicTitleProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode;
}

const EpicTitle = ({children, ...restProps}: EpicTitleProps) => {
  return (
    <div {...restProps}>
      <h1 className="epic-title">{children}</h1>
    </div>
  );
};

export {EpicTitle};
