import http from "@/api/http";

const priceApi = {
  findAllPrice: async (): Promise<IListResponseDefault<IPrice>> => {
    const res = await http.get("/api/prices?", {
      params: { "pagination[pageSize]": "1000000", populate: "*" },
    });
    return res?.data;
  },
};

export default priceApi;
