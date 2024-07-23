import http from "@/api/http";
import useAuthStore from "@/stores/authStore";

const teamApi = {
  findMyTeam: async (): Promise<ITeam> => {
    const res = await http.get("/api/teams/user/:uid", {
      params: { uid: useAuthStore.getState().user?.id },
    });
    return res?.data?.[0];
  },
};

export default teamApi;
