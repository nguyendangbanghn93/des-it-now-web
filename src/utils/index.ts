import env from "@/env";

const utils = {
  getImageStrapi: (
    image: IFileData,
    {
      size = "medium",
      urlDefault,
    }: {
      size?: "large" | "medium" | "small" | "thumbnail";
      urlDefault?: string;
    } = {}
  ) => {
    const objImg = image?.formats?.[size] || image?.formats?.["small"];
    const url = `${env.API_URL}${objImg?.url}` || urlDefault;
    return url;
  },
  formatMoney: (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  },
  objectToStrapiQuery: (obj: any) => {
    const result: any = {};

    function flattenObject(current: any, property: any) {
      if (Object(current) !== current || Array.isArray(current)) {
        result[property] = current;
      } else {
        for (const key in current) {
          flattenObject(current[key], property ? `${property}[${key}]` : key);
        }
      }
    }

    for (const key in obj) {
      flattenObject(obj[key], key);
    }

    return result;
  },
};

export default utils;
