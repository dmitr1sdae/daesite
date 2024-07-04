import axios from "axios";
import "../Profile.scss";
import {User} from "@daesite/shared";
import {Avatar} from "@daesite/components";

export const generateMetadata = async () => {
  const user = await getUserData();

  return {
    title: `${user.username} | dadaya`,
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
      <h1>{user.username}</h1>
      <Avatar size="huge" src={user.avatar} fallback={user.username} />
    </div>
  );
};

export default MyProfilePage;
