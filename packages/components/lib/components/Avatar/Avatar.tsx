"use client";

import "./Avatar.scss";

import {ElementType, forwardRef, Ref} from "react";
import {PolymorphicPropsWithRef} from "@daesite/react-polymorphic-types";
import {useColor} from "@daesite/hooks";
import AvatarImage from "./AvatarImage";
import AvatarProvider from "./AvatarProvider";
import AvatarFallback from "./AvatarFallback";

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

export type AvatarProps<E extends ElementType> = PolymorphicPropsWithRef<
  AvatarOwnProps,
  E
>;

const defaultElement = "div";

const Avatar = <E extends ElementType = typeof defaultElement>(
  {
    src,
    fallback,
    size = "medium",
    as,
    "data-testid": dataTestId,
    ...restProps
  }: AvatarProps<E>,
  ref: Ref<Element>,
) => {
  const color = useColor(fallback);

  return (
    <AvatarProvider
      {...restProps}
      style={{
        "--avatar-color": color,
      }}
      size={size}
      ref={ref}
      as={as}
      data-testid={dataTestId && `${dataTestId}-provider`}
    >
      <AvatarImage
        alt={fallback}
        size={size}
        src={src}
        data-testid={dataTestId && `${dataTestId}-image`}
      />
      <AvatarFallback data-testid={dataTestId && `${dataTestId}-fallback`}>
        {fallback?.charAt(0)}
      </AvatarFallback>
    </AvatarProvider>
  );
};

export default forwardRef(Avatar);
