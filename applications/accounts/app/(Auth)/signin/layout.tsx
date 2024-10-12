import {ReactNode} from "react";

import {Header} from "~/components/Header";

interface SignInLayoutProps {
  children: ReactNode;
}

const SignInLayout = ({children}: SignInLayoutProps) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default SignInLayout;
