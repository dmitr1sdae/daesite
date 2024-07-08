import comments from "postcss-discard-comments";

export default {
  plugins: [
    comments({
      removeAll: true,
    }),
  ],
};
