import type {StorybookConfig} from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../lib/**/*.stories.tsx"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
};
export default config;
