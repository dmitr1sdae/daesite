import {Meta} from "@storybook/react";

import Logo from "./Logo";

export default {
  component: Logo,
  title: "components/Logo",
} as Meta<typeof Logo>;

export const Playground = ({...args}) => <Logo {...args} to="#" />;

Playground.argTypes = {
  application: {
    options: [
      "apps",
      "account",
      "search",
      "language",
      "gist",
      "experiments",
      "projects",
      "close",
      "settings",
    ],
    control: {
      type: "select",
    },
  },
};