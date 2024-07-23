import http from "@/api/http";

const uploadApi = {
  uploadFiles: async (files: FileList): Promise<IFileData[]> => {
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    const res = await http.post("/api/upload", formData);
    return res?.data;
  },
  uploadFile: async (file: File): Promise<IFileData> => {
    const formData = new FormData();

    formData.append("files", file);

    const res = await http.post("/api/upload", formData);
    return res?.data?.[0];
  },

  deleteFile: async (id: string): Promise<any> => {
    const res = await http.delete(`/api/upload/files/${id}`);
    return res?.data;
  },
};

export default uploadApi;
