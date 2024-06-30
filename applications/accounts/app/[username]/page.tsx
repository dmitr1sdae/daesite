import {PublicUser} from "@daesite/shared";
import "./Profile.scss";
import axios from "axios";
import {Avatar} from "@daesite/components";
import {notFound} from "next/navigation";

interface ProfileProps {
  params: {
    username: string;
  };
  searchParams: {
    [key: string]: string | undefined;
  };
}

const getUserData = async (username: string) => {
  try {
    const res = await axios.get(`http://127.0.0.1:3000/users/${username}`);
    return res.data as PublicUser;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return undefined;
    }
    throw error;
  }
};

export default async ({params, searchParams}: ProfileProps) => {
  const user = await getUserData(params.username);

  if (!user) {
    notFound();
  }

  return (
    <div className="page">
      <h1>{user.username}</h1>
      <Avatar size="huge" src={user.avatar} fallback={user.username} />
    </div>
  );
};
