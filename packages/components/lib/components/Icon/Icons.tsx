import svg from "@daesite/styles/assets/img/icons/sprite-icons.svg?raw";
import {Portal} from "~/components";

export const ICONS_ID = "icons-root";

const Icons = () => {
  return (
    <Portal>
      <div id={ICONS_ID} dangerouslySetInnerHTML={{__html: `${svg}`}} />
    </Portal>
  );
};

export default Icons;
