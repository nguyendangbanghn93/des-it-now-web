import http from "@/api/http";
import uploadApi from "@/api/upload";
import { ERequestStatus } from "@/utils/constants";
import _ from "lodash";
import qs from "qs";

export interface IRequestFormCreate {
  id?: number;
  productType?: string;
  designType?: string;
  quantity?: number;
  totalPrice?: number;
  status?: ERequestStatus;
  note?: string;
  photos?: Array<IFileData | File>;
  data?: IPrice;
}

export enum ESortRequest {
  "createdAt:desc" = "createdAt:desc",
  "createdAt:asc" = "createdAt:asc",
}

export const sortOptions = [
  { value: ESortRequest["createdAt:desc"], label: "Mới nhất" },
  { value: ESortRequest["createdAt:asc"], label: "Cũ nhất" },
];

export interface IFindRequestParams {
  pagination: IPagination;
  status?: string;
  search?: string;
  sort?: ESortRequest;
}

const requestApi = {
  create: async (data: IRequestFormCreate): Promise<IRequest> => {
    const uploadPhotos = data?.photos
      ? await Promise.all(
          data?.photos?.map((f: any) =>
            f.url ? Promise.resolve(f) : uploadApi.uploadFile(f as File)
          )
        )
      : [];
    console.log("🚀 ~ uploadPhotos ~ uploadPhotos:", uploadPhotos);
    data.photos = uploadPhotos;
    const res = await http.post("/api/requests", { data });
    return res?.data;
  },

  find: async (
    params: IFindRequestParams
  ): Promise<IListResponseDefault<IRequest>> => {
    const queryParams = {
      pagination: {
        pageSize: params.pagination.pageSize,
        page: params.pagination.page,
      },
      filters: {
        $or: [
          { id: Number(params.search) },
          { name: { $contains: params.search } },
        ],
        status: params.status,
      },
      sort: [params.sort],
      populate: "*",
    };
    const queryString = qs.stringify(queryParams, {
      encode: false,

      filter(_, value) {
        return !value ? undefined : value;
      },
    });

    const res = await http.get(`/api/requests?${queryString}`);
    return res?.data;
  },

  update: async ({
    id,
    data,
  }: {
    id: number;
    data: IRequestFormCreate;
  }): Promise<IRequest> => {
    const res = await http.put(`/api/requests/${id}`, { data });
    return res?.data;
  },
};

export default requestApi;
