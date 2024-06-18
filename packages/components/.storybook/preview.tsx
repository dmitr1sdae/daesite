import type {Preview} from "@storybook/react";
import {BrowserRouter as Router} from "react-router-dom";
import {Icons} from "@components/Icon";

import "./index.scss";

const preview: Preview = {
  decorators: [
    (Story) => (
      <Router>
        <Icons />
        <Story />
      </Router>
    ),
  ],
  parameters: {
    actions: {argTypesRegex: "^on[A-Z].*"},
  },
};

export default preview;
