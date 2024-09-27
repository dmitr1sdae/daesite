import {GLOB_SRC} from "~/globs";
import {pluginPrettier} from "~/plugins";
import {ConfigItem} from "~/types";

export const prettier = (): ConfigItem[] => {
  return [
    {
      name: "daelint:prettier",
      files: [GLOB_SRC],
      plugins: {
        prettier: pluginPrettier,
      },
      rules: {
        "prettier/prettier": "error",
        "arrow-body-style": "off",
        "prefer-arrow-callback": "off",
      },
    },
  ];
};
