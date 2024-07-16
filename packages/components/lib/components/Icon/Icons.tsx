import svg from "@daesite/styles/assets/img/icons/sprite-icons.svg?raw";

export const ICONS_ID = "__iconsRoot";

const Icons = () => {
  return (
    <div id={ICONS_ID} dangerouslySetInnerHTML={{__html: svg}} />
  );
};

export default Icons;
