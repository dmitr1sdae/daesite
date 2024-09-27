import {GLOB_SRC} from "~/globs";
import {pluginStylistic} from "~/plugins";
import {ConfigItem} from "~/types";

export const stylistic = (): ConfigItem[] => {
  return [
    {
      name: "daelint:stylistic",
      files: [GLOB_SRC],
      plugins: {
        stylistic: pluginStylistic,
      },
      rules: {
        "stylistic/arrow-spacing": ["error", {after: true, before: true}],
        "stylistic/block-spacing": ["error", "never"],
        "stylistic/brace-style": ["error", "1tbs", {allowSingleLine: true}],
        "stylistic/comma-spacing": ["error", {after: true, before: false}],
        "stylistic/comma-style": ["error", "last"],
        "stylistic/computed-property-spacing": [
          "error",
          "never",
          {enforceForClassMembers: true},
        ],
        "stylistic/dot-location": ["error", "property"],
        "stylistic/eol-last": "error",
        "stylistic/func-call-spacing": ["error", "never"],
        "stylistic/keyword-spacing": [
          "error",
          {
            before: true,
            after: true,
            overrides: {
              return: {after: true},
              throw: {after: true},
              case: {after: true},
            },
          },
        ],
        "stylistic/quotes": [
          "error",
          "double",
          {
            avoidEscape: true,
            allowTemplateLiterals: true,
          },
        ],
        "stylistic/semi": ["error", "always"],
        "stylistic/space-before-function-paren": [
          "error",
          {
            anonymous: "always",
            named: "never",
            asyncArrow: "always",
          },
        ],
        "stylistic/space-infix-ops": "error",
        "stylistic/object-curly-spacing": ["error", "never"],
        "stylistic/comma-dangle": [
          "error",
          {
            arrays: "only-multiline",
            objects: "always-multiline",
            imports: "always-multiline",
            exports: "always-multiline",
            functions: "always-multiline",
            generics: "ignore",
            enums: "only-multiline",
            tuples: "only-multiline",
          },
        ],
        "stylistic/lines-between-class-members": [
          "error",
          "always",
          {exceptAfterSingleLine: true},
        ],
        "stylistic/no-extra-semi": "error",
        "stylistic/space-before-blocks": "error",
        "stylistic/no-tabs": "error",
        "stylistic/jsx-closing-bracket-location": "error",
        "stylistic/jsx-closing-tag-location": "error",
        "stylistic/jsx-curly-brace-presence": [
          "error",
          {propElementValues: "always"},
        ],
        "stylistic/jsx-curly-newline": "error",
        "stylistic/jsx-curly-spacing": ["error", "never"],
        "stylistic/jsx-equals-spacing": "error",
        "stylistic/jsx-first-prop-new-line": "error",
        "stylistic/jsx-indent": [
          "error",
          2,
          {checkAttributes: true, indentLogicalExpressions: true},
        ],
        "stylistic/jsx-indent-props": ["error", 2],
        "stylistic/jsx-max-props-per-line": [
          "error",
          {maximum: 1, when: "multiline"},
        ],
        "stylistic/jsx-one-expression-per-line": [
          "error",
          {allow: "single-child"},
        ],
        "stylistic/jsx-quotes": "error",
        "stylistic/jsx-tag-spacing": [
          "error",
          {
            afterOpening: "never",
            beforeClosing: "never",
            beforeSelfClosing: "always",
            closingSlash: "never",
          },
        ],
        "stylistic/jsx-wrap-multilines": [
          "error",
          {
            arrow: "parens-new-line",
            assignment: "parens-new-line",
            condition: "parens-new-line",
            declaration: "parens-new-line",
            logical: "parens-new-line",
            prop: "parens-new-line",
            return: "parens-new-line",
          },
        ],
      },
    },
  ];
};
