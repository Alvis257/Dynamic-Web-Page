export interface User {
  username: string;
  email: string;
  password: string;
  role: string;
  rights: {
    admin: boolean;
    read: boolean;
    write: boolean;
    delete: boolean;
    share: boolean;
  };
}