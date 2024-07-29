/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly API_URL: string
    // more env variables...
}
interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface ITeam {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    members: IMember[];
}
interface IMember {
    id: number;
    role: string;
    user: IUser;
}
interface IUser {
    id: number;
    username: string;
    email?: any;
    provider?: any;
    password: string;
    resetPasswordToken?: any;
    confirmationToken?: any;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    fullname?: any;
    description?: any;
    phone?: string;
}

interface IProductType {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    prices?: IPrice[];
}

interface IDesignType {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    prices?: IPrice[];
}

interface IPrice {
    id: number;
    price: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    productType: IProductType;
    designType: IDesignType;
}

interface IListResponseDefault<T> {
    data: T[];
    meta: Meta;
}

interface Meta {
    pagination: Pagination;
}

interface Pagination {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
}

interface IFileData {
    id: number;
    name: string;
    alternativeText?: any;
    caption?: any;
    width: number;
    height: number;
    formats: Formats;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: any;
    provider: string;
    provider_metadata?: any;
    createdAt: string;
    updatedAt: string;
}
interface IFormats {
    large: ISizeImage;
    small: ISizeImage;
    medium: ISizeImage;
    thumbnail: ISizeImage;
}
interface ISizeImage {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path?: any;
    size: number;
    width: number;
    height: number;
    sizeInBytes: number;
}

interface IPagination {
    page?: number;
    pageSize?: number;
    pageCount?: number;
    total?: number;
}

interface IRequest {
    quantity: number;
    id: number;
    name?: any;
    status: string;
    designType: string;
    productType: string;
    totalPrice: number;
    createdAt: string;
    creator: IUser;
    photos: IFileData[];
    updatedAt: string;
    publishedAt: string;
    note: string;
    team: ITeam;
    assign: IUser;
    logs: {
        updatedAt: Date;
        status: "todo" | "doing" | "review" | "needEdit" | "done";
    };
}

// enum ERequestStatus {
//   todo = "todo",
//   doing = "doing",
//   review = "review",
//   needEdit = "needEdit",
//   done = "done",
// }

interface ITeam {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

interface ITransaction {
    id?: Key;
    [string]: any;
}
