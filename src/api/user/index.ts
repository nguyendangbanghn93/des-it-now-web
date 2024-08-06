import http from "@/api/http";
import uploadApi from "@/api/upload";
import _ from "lodash";

export interface IFormUpdateUser {
  fullname: string;
  phone: string;
  email: string;
  description: string;
  avatar?: IFileData | File | null;
}

const userApi = {
  async getMe(): Promise<IUser> {
    const res = await http.get("/api/users/me");
    return res.data;
  },

  async update({
    id,
    data,
  }: {
    id: number;
    data: IFormUpdateUser;
  }): Promise<IUser> {
    if (data.avatar && !_.get(data, "avatar.url")) {
      const avatar = await uploadApi.uploadFile(data.avatar as File);
      data.avatar = avatar as IFileData;
    }

    const res = await http.put(`/api/users/${id}`, data);
    return res.data;
  },
};

export default userApi;
