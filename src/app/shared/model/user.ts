import {Role} from './role';

export interface User {
  name: string;
  username: string;
  password: string;
  role: Role;
}
