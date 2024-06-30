"use client";

import "./Header.scss";

import {Avatar, Logo, Icon, Menu, Button} from "@daesite/components";
import {HTMLAttributes, useState} from "react";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {}

const Header = ({...restProps}: HeaderProps) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="header" {...restProps}>
      <Menu open={open} onClose={() => setOpen(!open)}></Menu>
      <nav className="navbar">
        <Logo application="accounts" to="/@me" />
        <div className="flex items-center gap-5">
          <div className="flex gap-4">
            <Button shape="ghost" className="icon-button">
              <Icon size={20} name="search" />
            </Button>
            <Button shape="ghost" className="icon-button">
              <Icon size={20} name="settings" />
            </Button>
            <Button shape="ghost" className="icon-button">
              <Icon size={20} name="apps" />
            </Button>
          </div>
          <Avatar
            src="https://avatars.githubusercontent.com/u/169852179"
            fallback="dmitr1sdae"
            size="small"
            as="button"
            onClick={() => setOpen(!open)}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
