"use client";

import "./Avatar.scss";

import {clsx} from "@daesite/utils";
import {
  ForwardedRef,
  forwardRef,
  HTMLProps,
  useContext,
  useEffect,
  useState,
} from "react";

import AvatarContext from "./AvatarContext";

interface AvatarFallbackProps extends HTMLProps<HTMLSpanElement> {
  delayMs?: number;
  /**
   * Locator for e2e tests.
   */
  "data-testid"?: string;
}

const AvatarFallback = (
  {delayMs = 20, ...restProps}: AvatarFallbackProps,
  ref: ForwardedRef<HTMLSpanElement>,
) => {
  const {imageLoadingStatus} = useContext(AvatarContext);
  const [canRender, setCanRender] = useState(delayMs === undefined);

  useEffect(() => {
    if (delayMs) {
      const timerId = window.setTimeout(() => setCanRender(true), delayMs);
      return () => window.clearTimeout(timerId);
    }
  }, [delayMs]);

  return canRender && imageLoadingStatus !== "loaded" ? (
    <span
      className={clsx("avatar-fallback", "rounded-full")}
      {...restProps}
      ref={ref}
    />
  ) : null;
};

export default forwardRef(AvatarFallback);
