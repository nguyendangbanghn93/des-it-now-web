import http from "@/api/http";

export interface IAuthParams {
  identifier: string;
  password: string;
}

export interface IResetPassword {
  password: string;
  passwordConfirmation: string;
  code: string;
}

export interface IFormChangePassword {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

export interface IForgotPassword {
  email: string;
}

const authApi = {
  async register(data: IAuthParams): Promise<{ jwt: string; user: IUser }> {
    const res = await http.post("/api/auth/register", {
      email: data.identifier,
      username: data.identifier,
      password: data.password,
    });
    return res.data;
  },
  async login(data: IAuthParams): Promise<{ jwt: string; user: IUser }> {
    const res = await http.post("/api/auth/local", data);
    return res.data;
  },

  async forgotPassword(data: IForgotPassword): Promise<any> {
    const res = await http.post("/api/auth/forgot-password", data);
    return res.data;
  },

  async resetPassword(
    data: IResetPassword
  ): Promise<{ jwt: string; user: IUser }> {
    const res = await http.post("/api/auth/reset-password", data);
    return res.data;
  },
  async changePassword(data: IFormChangePassword): Promise<any> {
    const res = await http.post("/api/auth/change-password", data);
    return res.data;
  },
};

export default authApi;
