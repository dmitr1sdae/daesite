import {Feature} from "./feature";
import {Role} from "./role";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  username: string;
}

export interface User extends PublicUser {
  features: Feature[];
  roles: Role[];
}
