import "./Avatar.scss";

import {clsx} from "@daesite/utils";
import {
  ForwardedRef,
  forwardRef,
  useContext,
  useEffect,
  useState,
} from "react";

import {AvatarSize} from "./Avatar";
import AvatarContext, {ImageLoadingStatus} from "./AvatarContext";

interface AvatarImageProps {
  /**
   * User avatar path
   */
  src: string;
  /**
   * Letter displayed when avatar loading error or missing avatar
   */
  alt?: string;
  /**
   * Controls how large the avatar should be.
   */
  size?: AvatarSize;
  /**
   * Locator for e2e tests.
   */
  "data-testid"?: string;
}

const useImageLoadingStatus = (src?: string) => {
  const [loadingStatus, setLoadingStatus] =
    useState<ImageLoadingStatus>("idle");

    useEffect(() => {
    if (!src) {
      setLoadingStatus("error");
      return;
    }

    let isMounted = true;
    const image = new window.Image();

    const updateStatus = (status: ImageLoadingStatus) => () => {
      if (!isMounted) {
        return;
      }

      setLoadingStatus(status);
    };

    setLoadingStatus("loading");
    image.onload = updateStatus("loaded");
    image.onerror = updateStatus("error");
    image.src = src;

    return () => {
      isMounted = false;
    };
  }, [src]);

  return loadingStatus;
};

const AvatarImage = (
  {src, alt, size = "medium", ...restProps}: AvatarImageProps,
  ref: ForwardedRef<HTMLImageElement>,
) => {
  const {onImageLoadingStatusChange} = useContext(AvatarContext);
  const imageLoadingStatus = useImageLoadingStatus(src);

  useEffect(() => {
    if (imageLoadingStatus !== "idle") {
      onImageLoadingStatusChange(imageLoadingStatus);
    }
  }, [imageLoadingStatus]);

  const avatarClassName = clsx(
    "avatar-img",
    "rounded-full",
    size !== "medium" && `avatar-${size}`,
  );

  return imageLoadingStatus === "loaded" ? (
    <img
      className={avatarClassName}
      {...restProps}
      ref={ref}
      src={src}
      alt={alt}
    />
  ) : null;
};

export default forwardRef(AvatarImage);
