import BaseDialog, { IBaseDialogProps } from "@/components/commons/BaseDialog";

import { renderToString } from "react-dom/server";

export interface IDialogOption extends IBaseDialogProps {}

const container = document.getElementById("root");

const dialog = {
  confirm: ({
    title = "Thông báo",
    content = "Nội dung thông báo",
  }: IDialogOption) => {
    container?.append(
      renderToString(
        <BaseDialog
          open={true}
          title={title}
          content={content}
          cancelButton={"Đóng"}
          okButton={"Đồng ý"}
        />
      )
    );
  },
  info: ({ title = "", content = "Nội dung thông báo" }: IDialogOption) => {
    container?.append(
      renderToString(
        <BaseDialog
          open={true}
          title={title}
          content={content}
          cancelButton={<></>}
          okButton={"Đóng"}
        />
      )
    );
  },
};

export default dialog;
