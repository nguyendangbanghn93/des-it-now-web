import http from "@/api/http";

export interface IAuthParams {
  identifier: string;
  password: string;
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
};

export default authApi;
