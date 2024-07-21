import {useId} from "@daesite/hooks";
import {clsx} from "@daesite/utils";
import {ComponentPropsWithoutRef} from "react";

export type CircleLoaderSize = "small" | "medium" | "large";

export interface CircleLoaderProps extends ComponentPropsWithoutRef<"svg"> {
  /**
   * Controls how large the loader should be.
   */
  size?: CircleLoaderSize;
  /**
   * Locator for e2e tests.
   */
  "data-testid"?: string;
}

const CircleLoader = ({
  size = "small",
  className,
  "data-testid": dataTestId,
  ...rest
}: CircleLoaderProps) => {
  const uid = useId();

  const sizeClasses = {
    small: "text-loader-small",
    medium: "text-loader-medium stroke-[1.3]",
    large: "text-loader-large stroke-[1]",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(
        "inline-block align-middle transform origin-center",
        "w-loader h-loader",
        sizeClasses[size],
        className,
      )}
      viewBox="0 0 16 16"
      data-testid={dataTestId}
      {...rest}
    >
      <defs>
        <circle id={uid} cx="8" cy="8" r="7" />
      </defs>
      <use href={`#${uid}`} className="fill-none stroke-current opacity-20" />
      <use
        href={`#${uid}`}
        className="fill-none stroke-current stroke-[2] stroke-linecap-round animate-loader-stroke"
      />
    </svg>
  );
};

export default CircleLoader;
