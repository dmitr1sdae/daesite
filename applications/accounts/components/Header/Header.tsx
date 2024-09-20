"use client";

import "./Header.scss";
import {HTMLAttributes, useState} from "react";
import {
  Avatar,
  Menu,
  Button,
  Icon,
  Logo,
  AppLink,
} from "@daesite/components";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {}

const Header = ({...restProps}: HeaderProps) => {
  const [menus, setMenus] = useState({
    menu: false,
    popup: false,
  });

  return (
    <header className="top-0 right-0 left-0 w-full header" {...restProps}>
      <Menu
        open={menus.menu}
        onClose={() => setMenus(() => ({menu: false, popup: false}))}
      >
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
          onClick={() =>
            setMenus((menues) => ({menu: !menues.menu, popup: false}))
          }
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
          <Icon size={16} name="email" />
          Email
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
      <nav className="flex flex-auto justify-space-between items-center mx-auto px-10 navbar">
        <Logo application="accounts" to="/@me" />
        <div className="flex items-center gap-5 items">
          <Avatar
            src="https://avatars.githubusercontent.com/u/169852179"
            fallback="dmitr1sdae"
            size="small"
            as="button"
            onClick={() =>
              setMenus((menues) => ({menu: !menues.menu, popup: false}))
            }
          />
        </div>
      </nav>
    </header>
  );
};

export {Header};
