import http from "@/api/http";

export interface IFindRequestParams {
  pagination: IPagination;
  sort?: ESortTransaction;
}

export enum ESortTransaction {
  "createdAt:desc" = "createdAt:desc",
  "createdAt:asc" = "createdAt:asc",
}

const transactionApi = {
  find: async (
    params: IFindRequestParams
  ): Promise<IListResponseDefault<ITransaction>> => {
    const res = await http.get("/api/transactions", { params });
    return res?.data;
  },
  create: async (amount: number) => {
    const res = await http.post("/api/transactions", { amount });
    return res?.data;
  },
};

export default transactionApi;
