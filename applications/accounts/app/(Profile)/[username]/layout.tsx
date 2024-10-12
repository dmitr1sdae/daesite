import {ReactNode} from "react";

import {Header} from "~/components/Header";

interface ProfileLayoutProps {
  params: {
    username: string;
  };
  profile: ReactNode;
  me: ReactNode;
}

const ProfileLayout = ({params, profile, me}: ProfileLayoutProps) => {
  const isMe = params.username === "%40me";

  return (
    <>
      <Header />
      {isMe ? me : profile}
    </>
  );
};

export default ProfileLayout;
