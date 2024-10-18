import "../Profile.scss";

import {Avatar} from "@daesite/components";
import {User} from "@daesite/shared";
import axios from "axios";

import {EpicTitle} from "~/components/EpicTitle";

export const generateMetadata = async () => {
  const user = await getUserData();

  return {
    title: `${user.username} - dadaya`,
  };
};

const getUserData = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:3000/users/@me`);
    return res.data as User;
  } catch (error) {
    throw error;
  }
};

const MyProfilePage = async () => {
  const user = await getUserData();

  return (
    <div className="profile-page page">
      <EpicTitle>{user.username}</EpicTitle>
      <Avatar size="huge" src={user.avatar} fallback={user.username} />
    </div>
  );
};

export default MyProfilePage;
