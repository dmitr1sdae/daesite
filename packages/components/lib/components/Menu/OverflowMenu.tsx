import {ReactNode} from "react";
import "./OverflowMenu.scss";

import {clsx} from "@daesite/utils";

type OverflowMenuProps = {
  children: ReactNode;
  /**
   * Whether the modal is open or not.
   */
  open: boolean;
  /**
   * Fires when the user clicks on the close button or when he
   * presses the escape key
   */
  onClose: () => void;
};

const OverflowMenu = ({open, onClose, children}: OverflowMenuProps) => {
  return (
    <div className={clsx("popup-menu", open && "active")}>
      {children}
    </div>
  )
};

export default OverflowMenu;
