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
};

export default utils;
