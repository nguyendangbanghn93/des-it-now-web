import http from "@/api/http";

export interface IAuthParams {
  username: string;
  password: string;
}

const authApi = {
  async register(data: IAuthParams) {
    const res = await http.post("/api/auth/register", data);
    return res;
  },
  async login(data: IAuthParams) {
    const res = await http.post("/api/auth/login", data);
    return res;
  },
};

export default authApi;
