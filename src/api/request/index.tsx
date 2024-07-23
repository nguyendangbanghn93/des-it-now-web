import http from "@/api/http";

const requestApi = {
  create: async (data: any): Promise<any> => {
    const res = await http.post("/api/requests", {data});
    return res?.data?.[0];
  },
};

export default requestApi;
