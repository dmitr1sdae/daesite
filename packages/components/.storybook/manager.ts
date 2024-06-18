import {addons} from "@storybook/manager-api";
import theme from "./theme";

addons.setConfig({
  theme: theme,
  isFullscreen: false,
  showNav: true,
  showPanel: true,
  panelPosition: "bottom",
  shouldShowToolbar: false,
  selectedPanel: undefined,
  enableShortcuts: false,
  sidebar: {
    showRoots: true,
    collapsedRoots: ["other"],
  },
  toolbar: {
    addons: {hidden: true},
    theme: {hidden: true},
    zoom: {hidden: false},
    eject: {hidden: true},
    copy: {hidden: true},
    fullscreen: {hidden: true},
  },
});
