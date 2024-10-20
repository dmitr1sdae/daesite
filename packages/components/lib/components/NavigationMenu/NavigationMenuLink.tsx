"use client";

import "./NavigationMenu.scss";

import {Icon, IconName} from "@components/Icon";
import {NavigationMenuTrigger} from "@norns-ui/navigation-menu";
import {ReactNode} from "react";

interface NavigationMenuLinkProps {
  children: ReactNode;
  icon?: IconName;
}

const NavigationMenuLink = ({children, icon}: NavigationMenuLinkProps) => {
  return (
    <NavigationMenuTrigger className="NavigationMenuTrigger">
      {children}
      {icon && <Icon className="CaretDown" name={icon} size={14} />}
    </NavigationMenuTrigger>
  );
};

export {NavigationMenuLink};
