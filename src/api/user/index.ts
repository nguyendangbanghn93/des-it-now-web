import http from "@/api/http";
import uploadApi from "@/api/upload";
import utils from "@/utils";
import _ from "lodash";

export interface IFormUpdateUser {
  fullname?: string;
  phone?: string;
  email?: string;
  description?: string;
  avatar?: IFileData | File | null;
  subscription?: any;
}

export interface ICreateUser {
  email: string;
}

const userApi = {
  async getMe(token: string | null): Promise<IUser | null> {
    if (!token) return null;
    const res = await http.get("/api/users/me");
    return res.data;
  },

  async addSubscription(token?: string | null): Promise<any> {
    if (!token) return null;
    const subscription = await utils.subscribeUser();
    const res = await userApi.updateMe({ subscription });

    return res;
  },
  async updateMe(data: IFormUpdateUser): Promise<IUser> {
    if (data?.avatar && !_.get(data, "avatar.url")) {
      const avatar = await uploadApi.uploadFile(data.avatar as File);
      data.avatar = avatar as IFileData;
    }

    const res = await http.put(`/api/users/update-me`, data);
    return res.data;
  },

  async create(data: ICreateUser) {
    const res = await http.post(`/api/users/create`, data);
    return res.data;
  },
};

export default userApi;
