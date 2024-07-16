import "./OverflowMenu.scss";

import {forwardRef, ReactNode, Ref} from "react";
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

const OverflowMenu = ({open, onClose, children}: OverflowMenuProps, ref: Ref<HTMLDivElement>,) => {
  return (
    <div ref={ref} className={clsx("popup-menu", open && "active")}>
      {children}
    </div>
  )
};

export default forwardRef(OverflowMenu);
