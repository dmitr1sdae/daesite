import "./Header.scss";

import {AppLink, Logo, Icon} from "@daesite/components";
import {HTMLAttributes} from "react";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {}

const Header = ({...restProps}: HeaderProps) => {
  return (
    <header
      className="header"
      {...restProps}
    >
      <nav className="navbar">
        <Logo as={AppLink} to="/" />
        <div className="buttons">
          <Icon size={20} name="search" />
          <Icon size={20} name="settings" />
        </div>
      </nav>
    </header>
  );
};

export default Header;
