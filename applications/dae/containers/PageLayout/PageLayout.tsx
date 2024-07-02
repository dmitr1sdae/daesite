import {Header} from "@components/Header";
import {ReactNode} from "react";

type PageLayoutProps = {
  children?: ReactNode;
  className?: string;
};

const PageLayout = ({children, className}: PageLayoutProps) => {
  return (
    <>
      <Header />
      <div className={className}>{children}</div>
    </>
  );
};

export default PageLayout;
