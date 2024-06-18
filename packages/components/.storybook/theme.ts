import {create} from "@storybook/theming";

export default create({
  base: "dark",

  fontBase: '"Inter", sans-serif',
  fontCode: "monospace",

  brandTitle: "dadaya's Design",

  colorPrimary: "#9747ff",
  colorSecondary: "#9747ff",

  appBg: "#1e1e1e",
  appContentBg: "#09090d",
  appBorderColor: "#9747ff",
  appBorderRadius: 0,

  // Toolbar default and active colors
  barTextColor: "#9E9E9E",
  barSelectedColor: "#585C6D",
  barBg: "#1e1e1e",

  // Form colors
  inputBg: "#232427",
  inputBorder: "#9747ff",
  inputTextColor: "#ffffff",
  inputBorderRadius: 2,
});
