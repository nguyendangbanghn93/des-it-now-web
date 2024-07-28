import http from "@/api/http";
const teamApi = {
  getMyTeam: async () => {
    const res = await http.get("/api/teams/me");
    return res?.data;
  },
};

export default teamApi;
