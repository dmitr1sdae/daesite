import {TypewriterClass} from "typewriter-effect";

export type Tag = {
  title: string;
  options: (string | Tag)[];
};

const parseTag = (typewriter: TypewriterClass, tag: Tag) => {
  typewriter.typeString(tag.title + " ");

  tag.options.forEach((option) => {
    if (typeof option === "string") {
      typewriter.typeString(option).pauseFor(1200).deleteChars(option.length);
    } else {
      parseTag(typewriter, option);
    }
  });
};

const typeStringSequence = (
  typewriter: TypewriterClass,
  tags: Tag[],
): TypewriterClass => {
  tags.forEach((tag) => {
    if (typeof tag === "string") {
      typewriter.typeString(tag).pauseFor(1200).deleteAll();
    } else {
      parseTag(typewriter, tag);
      typewriter.deleteAll();
    }
  });
  return typewriter.start();
};

export default typeStringSequence;
