import http from "@/api/http";

export interface IAuthParams {
  username: string;
  password: string;
}

const authApi = {
  async register(data: IAuthParams): Promise<{ jwt: string; user: IUser }> {
    const res = await http.post("/api/auth/register", data);
    return res.data;
  },
  async login(data: IAuthParams): Promise<{ jwt: string; user: IUser }> {
    const res = await http.post("/api/auth/login", data);
    return res.data;
  },
};

export default authApi;
