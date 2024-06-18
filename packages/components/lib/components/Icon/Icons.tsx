import svg from "@daesite/styles/assets/img/icons/sprite-icons.svg?raw";

export const ICONS_ID = "icons-root";

const Icons = () => {
  return <div id={ICONS_ID} dangerouslySetInnerHTML={{__html: `${svg}`}} />;
};

export default Icons;
