import {Meta} from "@storybook/react";

import Logo from "./Logo";

export default {
  component: Logo,
  title: "components/Logo",
} as Meta<typeof Logo>;

export const Playground = () => <Logo as="button" />;
