import http from "@/api/http";

export interface IRequestForm {
  id?: number;
  productType: string;
  designType?: string;
  sampleQuantity: number;
  totalPrice: number;
  note: string;
  photos: Array<IFileData | File>;
}

const requestApi = {
  create: async (data: IRequestForm): Promise<IRequest> => {
    const res = await http.post("/api/requests", { data });
    return res?.data;
  },
  find: async (): Promise<IListResponseDefault<IRequest>> => {
    const res = await http.get("/api/requests?populate=*");
    return res?.data;
  },
};

export default requestApi;
