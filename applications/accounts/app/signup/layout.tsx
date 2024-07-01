import {ReactNode} from "react";
import {Header} from "~/components/Header";

interface SignUpLayoutProps {
  children: ReactNode;
}

const SignUpLayout = ({children}: SignUpLayoutProps) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default SignUpLayout;
