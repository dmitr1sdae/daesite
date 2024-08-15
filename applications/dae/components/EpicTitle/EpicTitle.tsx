import "./EpicTitle.scss";

import {ReactNode} from "react";

interface EpicTitleProps {
  children: ReactNode;
}

const EpicTitle = ({children}: EpicTitleProps) => {
  return (
    <div>
      <h1 className="epic-title">{children}</h1>
    </div>
  );
};

export default EpicTitle;
