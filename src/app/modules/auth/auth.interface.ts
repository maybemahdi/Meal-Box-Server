export interface IRegisterUser {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}

export interface ILoginUser {
  email: string;
  password: string;
  rememberMe?: boolean;
}
