import {ReactNode} from "react";
import {Header} from "~/components/Header";

interface ProfileLayoutProps {
  children: ReactNode;
}

const ProfileLayout = ({children}: ProfileLayoutProps) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default ProfileLayout;
