export interface User {

  userID: number;
  username: string;
  email: string;
  password: string;
  role: string;
  resetCode?: string;
  rights: {
    admin: boolean;
    read: boolean;
    write: boolean;
    delete: boolean;
    share: boolean;
  };
}