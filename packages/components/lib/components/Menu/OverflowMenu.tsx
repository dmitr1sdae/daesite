"use client";

import "./OverflowMenu.scss";

import {useClickOutside} from "@daesite/hooks";
import {clsx} from "@daesite/utils";
import {ReactNode, RefObject} from "react";

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
  /**
   * Ref to the button that opens the menu
   */
  buttonRef?: RefObject<HTMLElement>;
};

const OverflowMenu = ({
  open,
  onClose,
  children,
  buttonRef,
}: OverflowMenuProps) => {
  const menuRef = useClickOutside<HTMLDivElement>(onClose, buttonRef);

  return (
    <div ref={menuRef} className={clsx("popup-menu", open && "active")}>
      {children}
    </div>
  );
};

export default OverflowMenu;
