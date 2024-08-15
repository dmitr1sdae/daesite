import "./Button.scss";

import {PolymorphicPropsWithRef} from "@daesite/react-polymorphic-types";
import {ThemeColor, ThemeColorUnion} from "@daesite/shared";
import {clsx} from "@daesite/utils";
import {ElementType, ForwardedRef, forwardRef} from "react";

import {CircleLoader} from "~/components/CircleLoader";

export type ButtonShape = "ghost" | "solid" | "outline";

export type ButtonSize = "small" | "medium" | "large";

interface ButtonOwnProps {
  /**
   * Whether the button should render a loader.
   * Button is disabled when this prop is true.
   */
  loading?: boolean;
  /**
   * Controls the shape of the button.
   * - `ghost` for texted button
   * - `solid` for filled button
   * - `outline` for bordered button
   */
  shape?: ButtonShape;
  /**
   * Controls the colors of the button.
   * Exact styles applied to depend on the chosen shape as well.
   */
  color?: ThemeColorUnion;
  /**
   * Controls how large the button should be.
   */
  size?: ButtonSize;
  /**
   * Controls the width of the button.
   * - `false` for width of text length
   * - `true` for width of parent container
   */
  fullWidth?: boolean;
  /**
   * Puts the button in a disabled state.
   */
  disabled?: boolean;
  /**
   * Locator for e2e tests.
   */
  "data-testid"?: string;
}

export type ButtonProps<E extends ElementType> = PolymorphicPropsWithRef<
  ButtonOwnProps,
  E
>;

const defaultElement = "button";

const Button = <E extends ElementType = typeof defaultElement>(
  {
    loading = false,
    disabled = false,
    fullWidth = false,
    className,
    tabIndex,
    children,
    shape = "solid",
    color = ThemeColor.Primary,
    size = "medium",
    as,
    "data-testid": dataTestId,
    ...restProps
  }: ButtonProps<E>,
  ref: ForwardedRef<Element>,
) => {
  const isDisabled = loading || disabled;

  const Element: ElementType = as || defaultElement;

  const buttonClassName = clsx(
    "button",
    fullWidth && "w-full",
    size !== "medium" && `button-${size}`,
    `button-${shape}-${color}`,
    Element !== "button" && "inline-block text-center",
    className,
  );

  const roleProps =
    restProps.onClick && !restProps.type ? {role: "button"} : undefined;

  return (
    <Element
      ref={ref}
      className={buttonClassName}
      disabled={isDisabled}
      tabIndex={isDisabled ? -1 : tabIndex}
      aria-busy={loading}
      data-testid={dataTestId}
      {...roleProps}
      {...restProps}
    >
      {children}
      {loading && (
        <span className="button-loader-container">
          <CircleLoader />
        </span>
      )}
    </Element>
  );
};

export default forwardRef(Button);
