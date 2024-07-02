"use client";

import "./Header.scss";

import {Avatar, Logo, AppLink, Icon, Menu, Button} from "@daesite/components";
import {HTMLAttributes, useState} from "react";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {}

const Header = ({...restProps}: HeaderProps) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="header" {...restProps}>
      <Menu open={open} onClose={() => setOpen(!open)}>
        <div className="flex flex-column items-center gap-4">
          <Avatar
            src="https://avatars.githubusercontent.com/u/169852179"
            fallback="dmitr1sdae"
            size="large"
          />
          <h2 className="text-normal">Heyo, Dmitriy!</h2>
        </div>
        <Button
          as={AppLink}
          to="/@me"
          onClick={() => setOpen(!open)}
          fullWidth
          className="flex gap-2 justify-center items-center"
          tabIndex={0}
        >
          <Icon size={16} name="account" />
          Your profile
        </Button>
        <Button fullWidth className="flex gap-2 justify-center items-center">
          <Icon size={16} name="gist" />
          Your gists
        </Button>
        <Button fullWidth className="flex gap-2 justify-center items-center">
          <Icon size={16} name="projects" />
          Your projects
        </Button>
        <Button fullWidth className="flex gap-2 justify-center items-center">
          <Icon size={16} name="experiments" />
          Experiments
        </Button>
        <Button fullWidth className="flex gap-2 justify-center items-center">
          <Icon size={16} name="language" />
          Language
        </Button>
        <Button fullWidth className="flex gap-2 justify-center items-center">
          <Icon size={16} name="settings" />
          Settings
        </Button>
      </Menu>
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
