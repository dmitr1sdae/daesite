"use client";

import {default as TypewriterEffect} from "typewriter-effect";
import typeStringSequence, {Tag} from "@helpers/typeStringSequence";

interface TypewriterProps {
  tags: Tag[];
}

const Typewriter = ({tags}: TypewriterProps) => {
  return (
    <TypewriterEffect
      options={{
        autoStart: true,
        loop: true,
      }}
      onInit={(typewriter) => {
        typeStringSequence(typewriter, tags);
      }}
    />
  );
};

export default Typewriter;
