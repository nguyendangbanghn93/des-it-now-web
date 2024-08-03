import http from "@/api/http";

export interface IFindTransactionParams {
  pagination: IPagination;
  sort?: ESortTransaction;
}

export enum ESortTransaction {
  "createdAt:desc" = "createdAt:desc",
  "createdAt:asc" = "createdAt:asc",
}

export const sortTransactionOptions = [
  {
    value: ESortTransaction["createdAt:desc"],
    label: "Mới nhất",
  },
  {
    value: ESortTransaction["createdAt:asc"],
    label: "Cũ nhất",
  },
];

const transactionApi = {
  find: async (
    params: IFindTransactionParams
  ): Promise<IListResponseDefault<ITransaction>> => {
    const res = await http.get("/api/transactions", { params });
    return res?.data;
  },
  create: async (amount: number): Promise<ITransaction> => {
    const res = await http.post("/api/transactions", { amount });
    return res?.data;
  },
};

export default transactionApi;
