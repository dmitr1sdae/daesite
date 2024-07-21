"use client";

import {useEffect, useRef, RefObject} from "react";

type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void;

const useClickOutside = <T extends HTMLElement = HTMLElement>(
  handler: ClickOutsideHandler,
  ignoreRef?: RefObject<HTMLElement | null>,
): RefObject<T> => {
  const domNode = useRef<T>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (
        !domNode.current ||
        domNode.current.contains(event.target as Node) ||
        (ignoreRef &&
          ignoreRef.current &&
          ignoreRef.current.contains(event.target as Node))
      ) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [handler, ignoreRef]);

  return domNode;
};

export {useClickOutside};
