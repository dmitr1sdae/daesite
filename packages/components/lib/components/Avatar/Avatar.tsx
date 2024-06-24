import "./Avatar.scss";

import {PolymorphicPropsWithRef} from "@daesite/react-polymorphic-types";
import {ElementType, forwardRef, Ref} from "react";

import AvatarFallback from "./AvatarFallback";
import AvatarImage from "./AvatarImage";
import AvatarProvider from "./AvatarProvider";

export type AvatarSize = "small" | "medium" | "large" | "huge";

interface AvatarOwnProps {
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

const generateColor = (str?: string) => {
  if (!str) {
    return "var(--primary)";
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  hash = (hash ^ 0x1f0d88) & 0xffffff;

  const brightness =
    (0.2126 * ((hash >> 16) & 0xff) +
      0.7152 * ((hash >> 8) & 0xff) +
      0.0722 * (hash & 0xff)) /
    255;

  if (brightness < 0.2) {
    hash = hash + 0x666666;
  } else if (brightness > 0.8) {
    hash = hash - 0x666666;
  }

  let color = "#";
  for (let j = 0; j < 3; j++) {
    let value = (hash >> (j * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }

  return color;
};

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
  return (
    <AvatarProvider
      {...restProps}
      style={{
        "--avatar-color": generateColor(fallback),
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
