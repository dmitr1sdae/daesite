import {GLOB_EXCLUDE} from "~/globs";
import {ConfigItem} from "~/types";

export const ignores = (): ConfigItem[] => {
  return [
    {
      ignores: GLOB_EXCLUDE,
    },
  ];
};
