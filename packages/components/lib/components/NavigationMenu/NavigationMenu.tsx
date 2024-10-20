"use client";

import "./NavigationMenu.scss";

import {
  NavigationMenu as NornsNavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink as NornsNavigationMenuLink,
  NavigationMenuList,
  NavigationMenuViewport,
} from "@norns-ui/navigation-menu";

import {ListItem} from "./ListItem";
import {NavigationMenuLink} from "./NavigationMenuLink";

const NavigationMenu = () => {
  return (
    <NornsNavigationMenu className="NavigationMenuRoot">
      <NavigationMenuList className="NavigationMenuList">
        <NavigationMenuItem>
          <NavigationMenuLink icon="caret-down">About</NavigationMenuLink>
          <NavigationMenuContent className="NavigationMenuContent">
            <ul className="List one">
              <li style={{gridRow: "span 3"}}>
                <NornsNavigationMenuLink asChild>
                  <a className="Callout" href="/">
                    <svg
                      aria-hidden
                      width="38"
                      height="38"
                      viewBox="0 0 25 25"
                      fill="white"
                    >
                      <path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z" />
                      <path d="M12 0H4V8H12V0Z" />
                      <path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z" />
                    </svg>
                    <div className="CalloutHeading">Primitives</div>
                    <p className="CalloutText">
                      Unstyled, accessible components for React.
                    </p>
                  </a>
                </NornsNavigationMenuLink>
              </li>

              <ListItem href="https://stitches.dev/" title="Stitches">
                CSS-in-JS with best-in-class developer experience.
              </ListItem>
              <ListItem href="/colors" title="Colors">
                Beautiful, thought-out palettes with auto dark mode.
              </ListItem>
              <ListItem href="https://icons.asd.com/" title="Icons">
                A crisp set of 15x15 icons, balanced and consistent.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink icon="caret-down">Apps</NavigationMenuLink>
          <NavigationMenuContent className="NavigationMenuContent">
            <ul className="List two">
              <ListItem
                icon="projects"
                title="X Proxy"
                href="https://x.dmitr1sdae.com"
              >
                A Proxy service
              </ListItem>
              <ListItem
                title="Getting started"
                href="/primitives/docs/overview/getting-started"
              >
                A quick tutorial to get you up and running with Primitives.
              </ListItem>
              <ListItem title="Styling" href="/primitives/docs/guides/styling">
                Unstyled and compatible with any styling solution.
              </ListItem>
              <ListItem
                title="Animation"
                href="/primitives/docs/guides/animation"
              >
                Use CSS keyframes or any animation library of your choice.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NornsNavigationMenuLink
            className="NavigationMenuLink"
            href="https://github.com/dmitr1sdae"
          >
            Github
          </NornsNavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuIndicator className="NavigationMenuIndicator">
          <div className="Arrow" />
        </NavigationMenuIndicator>
      </NavigationMenuList>

      <div className="ViewportPosition">
        <NavigationMenuViewport className="NavigationMenuViewport" />
      </div>
    </NornsNavigationMenu>
  );
};

export {NavigationMenu};
