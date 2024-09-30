"use client";

import "./Avatar.scss";

import {useColor} from "@daesite/hooks";
import {
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
} from "@daesite/react-polymorphic-types";
import {clsx} from "@daesite/utils";
import {
  Avatar as NornsAvatar,
  AvatarFallback,
  AvatarImage,
} from "@norns-ui/avatar";
import {CSSProperties, ElementType, ForwardedRef, forwardRef} from "react";

export const AvatarDefaultElement = "span";

export type AvatarSize = "small" | "medium" | "large" | "huge";

export interface AvatarOwnProps {
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

export type AvatarProps<T extends ElementType = typeof AvatarDefaultElement> =
  PolymorphicPropsWithRef<AvatarOwnProps, T>;

const Avatar = forwardRef(
  <C extends ElementType = typeof AvatarDefaultElement>(
    {
      as,
      src,
      fallback,
      size = "medium",
      "data-testid": dataTestId,
      ...restProps
    }: PolymorphicPropsWithoutRef<AvatarOwnProps, C>,
    ref: ForwardedRef<Element>,
  ) => {
    const Element: ElementType = as || AvatarDefaultElement;
    const color = useColor(fallback);

    return (
      <NornsAvatar asChild>
        <Element
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
        </Element>
      </NornsAvatar>
    );
  },
);

Avatar.displayName = "Avatar";

export {Avatar};
