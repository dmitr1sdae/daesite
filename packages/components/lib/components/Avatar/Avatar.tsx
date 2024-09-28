"use client";

import "./Avatar.scss";

import {useColor} from "@daesite/hooks";
import {clsx} from "@daesite/utils";
import {
  Avatar as NornsAvatar,
  AvatarFallback,
  AvatarImage,
  AvatarProps as NornAvatarProps,
} from "@norns-ui/avatar";
import {CSSProperties, forwardRef, Ref} from "react";

export type AvatarSize = "small" | "medium" | "large" | "huge";

export interface AvatarProps extends NornAvatarProps {
  /**
   * User avatar path
   */
  src: string;
  /**
   * Letter displayed when avatar loading error or missing avatar
   */
  fallback?: string;
  /**
   * Controls how large the avatar should be.
   */
  size?: AvatarSize;
  /**
   * Locator for e2e tests.
   */
  "data-testid"?: string;
}

const Avatar = forwardRef(
  (
    {
      src,
      fallback,
      size = "medium",
      "data-testid": dataTestId,
      ...restProps
    }: AvatarProps,
    ref: Ref<HTMLSpanElement>,
  ) => {
    const color = useColor(fallback);

    return (
      <NornsAvatar
        {...restProps}
        style={
          {
            "--avatar-color": color,
          } as CSSProperties
        }
        className={clsx(
          "avatar-container",
          "rounded-full",
          size !== "medium" && `avatar-${size}`,
        )}
        ref={ref}
        data-testid={dataTestId && `${dataTestId}-provider`}
      >
        <AvatarImage
          alt={fallback}
          src={src}
          className={clsx(
            "avatar-img",
            "rounded-full",
            size !== "medium" && `avatar-${size}`,
          )}
          data-testid={dataTestId && `${dataTestId}-image`}
        />
        <AvatarFallback
          className={clsx("avatar-fallback", "rounded-full")}
          data-testid={dataTestId && `${dataTestId}-fallback`}
        >
          {fallback?.charAt(0)}
        </AvatarFallback>
      </NornsAvatar>
    );
  },
);

export {Avatar};
