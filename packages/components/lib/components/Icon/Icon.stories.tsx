import {Meta} from "@storybook/react";

import Icon from "./Icon";

export default {
  component: Icon,
  title: "components/Icon",
} as Meta<typeof Icon>;

// @ts-ignore
export const Playground = ({...args}) => <Icon {...args} />;

Playground.argTypes = {
  name: {
    options: ["apps", "search", "settings"],
    control: {
      type: "select",
      defaultValue: "search",
    },
  },
  size: {
    options: [20, 22, 24],
  }
};

