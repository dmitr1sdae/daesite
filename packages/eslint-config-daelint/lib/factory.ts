import {isPackageExists} from "local-pkg";

import {
  core,
  ignores,
  prettier,
  react,
  sortKeys,
  stylistic,
  typescript,
  unicorn,
} from "./configs";
import {ConfigItem, OptionsConfig} from "./types";
import {combine} from "./utils";

export const daelint = (
  options: OptionsConfig & ConfigItem = {},
  ...userConfigs: (ConfigItem | ConfigItem[])[]
): ConfigItem[] => {
  const {
    react: enableReact = isPackageExists("react"),
    typescript: enableTypeScript = isPackageExists("typescript"),
    overrides = {},
    componentExts = [],
  } = options;

  const configs: ConfigItem[][] = [];

  if (enableTypeScript) {
    configs.push(
      typescript({
        ...(typeof enableTypeScript !== "boolean" ? enableTypeScript : {}),
        componentExts,
        overrides: overrides.typescript,
      }),
    );
  }

  if (enableReact) {
    configs.push(react());
  }

  configs.push(
    core(),
    ignores(),
    stylistic(),
    unicorn(),
    sortKeys(),
    prettier(),
  );

  return combine(...configs, ...userConfigs);
};
