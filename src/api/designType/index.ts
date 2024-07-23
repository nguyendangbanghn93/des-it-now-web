import http from "@/api/http";

const designTypeApi = {
  findAllDesignType: async (): Promise<IListResponseDefault<IDesignType>> => {
    const res = await http.get("/api/design-types?", {
      params: { "pagination[pageSize]": "1000000", populate: "*" },
    });
    return res?.data;
  },
};

export default designTypeApi;
