import http from "@/api/http";
const teamApi = {
  getMyTeam: async (): Promise<ITeam> => {
    const res = await http.get("/api/teams/me");
    return res?.data;
  },

  kick: async (idMember: string): Promise<ITeam> => {
    const res = await http.post(`/api/teams/kick/${idMember}`);
    return res?.data;
  },
};

export default teamApi;
