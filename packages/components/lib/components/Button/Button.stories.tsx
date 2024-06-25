import {Meta} from "@storybook/react";

import Button from "./Button";

export default {
  component: Button,
  title: "components/Button",
} as Meta<typeof Button>;

export const Playground = ({...args}) => <Button {...args}>test</Button>;

Playground.argTypes = {
  size: {
    options: ["small", "medium", "large"],
    control: {
      type: "select",
      defaultValue: "medium",
    },
  },
  color: {
    options: ["primary", "secondary", "danger", "warning", "success"],
    control: {
      type: "select",
      defaultValue: "primary",
    },
  },
  shape: {
    options: ["solid", "ghost", "outline"],
    control: {
      type: "select",
      defaultValue: "solid",
    },
  },
  loading: {
    control: {
      type: "boolean",
    },
  },
  fullWidth: {
    control: {
      type: "boolean",
    },
  },
};
