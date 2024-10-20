import {clsx} from "@daesite/utils";
import {NavigationMenuLink} from "@norns-ui/navigation-menu";
import {forwardRef, ReactNode, Ref} from "react";

import {Icon, IconName} from "~/components/Icon";

interface ListItemProps {
  className?: string;
  children: ReactNode;
  icon?: IconName;
  title?: string;
  href?: string;
}

const ListItem = forwardRef(
  (
    {className, children, title, icon, ...restProps}: ListItemProps,
    forwardedRef: Ref<HTMLAnchorElement>,
  ) => (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={clsx("ListItemLink", className)}
          {...restProps}
          ref={forwardedRef}
        >
          <div className="ListItemHeading">
            {icon && <Icon name={icon} />}
            {title}
          </div>
          <p className="ListItemText">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  ),
);

export {ListItem};
