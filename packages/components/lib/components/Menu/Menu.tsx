import {clsx} from "@daesite/utils";
import "./Menu.scss";
import {Button} from "~/components/Button";
import {Icon} from "~/components/Icon";
import {Portal} from "~/components/Portal";
import {ReactNode} from "react";

type MenuProps = {
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

const Menu = ({children, open, onClose}: MenuProps) => {
  return (
    <Portal>
      <div className={clsx("menu", open && "active")} onClick={() => onClose()}>
        <div
          className={clsx("menu-body", open && "active")}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-column items-center gap-5">
            <Button
              onClick={() => onClose()}
              shape="ghost"
              className="close-button"
            >
              <Icon size={20} name="close" />
            </Button>
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Menu;
