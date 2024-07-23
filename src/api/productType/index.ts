import http from "@/api/http";

const productTypeApi = {
  findAllProductType: async (): Promise<IListResponseDefault<IProductType>> => {
    const res = await http.get("/api/product-types?", {
      params: { "pagination[pageSize]": "1000000", populate: "*" },
    });
    return res?.data;
  },
};

export default productTypeApi;
