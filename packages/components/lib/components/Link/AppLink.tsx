import {AnchorHTMLAttributes, forwardRef, Ref} from "react";
import {Link as ReactRouterLink} from "react-router-dom";

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "color"> & {
  /**
   * Provide the link href.
   */
  to: string;
  /**
   * Controls self opening.
   */
  selfOpening?: boolean;
};

const AppLink = (
  {to, selfOpening = false, children, ...rest}: AppLinkProps,
  ref: Ref<HTMLAnchorElement>,
) => {
  if (selfOpening) {
    return (
      <a ref={ref} href={to} target="_self" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <ReactRouterLink ref={ref} to={to} {...rest}>
      {children}
    </ReactRouterLink>
  );
};

export default forwardRef<HTMLAnchorElement, AppLinkProps>(AppLink);
