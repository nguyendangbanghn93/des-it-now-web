import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import { IconButton } from "@mui/material";
// import { useMutation } from "@tanstack/react-query";
// import uploadApi from "@/api/upload";
import utils from "@/utils";
const fileTypes = ["JPG", "PNG"];

import DeleteIcon from "@mui/icons-material/Delete";

export interface BaseUpload {
  onChange?: (files: File[]) => void;
  [key: string]: any;
}

const BaseUpload = React.forwardRef(
  ({ onChange, ...props }: BaseUpload, ref) => {
    const [files, setFiles] = useState<File[]>([]);

    // const { data: dataUpload, mutate: mutateUpload } = useMutation({
    //   mutationFn: uploadApi.uploadFiles,
    // });
    // const { mutate: mutateDelete } = useMutation({
    //   mutationFn: uploadApi.deleteFile,
    // });

    // useEffect(() => {
    //   dataUpload?.length && setFiles((s) => [...s, ...dataUpload]);
    // }, [dataUpload]);

    useEffect(() => {
      onChange && onChange(files);
    }, [files, onChange]);

    const handleChange = (files: File[]) => {
      setFiles((s) => [...s, ...Array.from(files)]);
      //   mutateUpload(files);
    };
    return (
      <>
        <div className="flex gap-4 flex-wrap " ref={ref}>
          {files?.map((f, i) => {
            return (
              <div className="relative group" key={i}>
                <div className="absolute top-0 right-0 translate-x-1/2 hidden group-hover:block ">
                  <IconButton
                    color="warning"
                    sx={{ padding: "1px" }}
                    onClick={() => {
                      setFiles((s) => s.filter((_, j) => i !== j));
                      //   mutateDelete(f.id as unknown as string);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
                <img
                  className="w-20 h-20 rounded-lg mt-4"
                  src={URL.createObjectURL(f)}
                />
              </div>
            );
          })}
        </div>
        <FileUploader
          {...props}
          className="mt-5"
          multiple
          handleChange={handleChange}
          name="file"
          types={fileTypes}
        >
          <div className="border border-dashed mt-4 p-4 rounded-lg flex justify-center items-center">
            <div className="flex gap-4">
              <IconButton>
                <FilterDramaIcon />
              </IconButton>
              <div>
                <div>Click tải ảnh lên hoặc kéo vào đấy</div>
                <em>(JPG,PNG)</em>
              </div>
            </div>
          </div>
        </FileUploader>
      </>
    );
  }
);
export default BaseUpload;
