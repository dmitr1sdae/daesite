import {ReactNode} from "react";
import {Header} from "~/components/Header";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = ({children}: HomeLayoutProps) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default HomeLayout;
