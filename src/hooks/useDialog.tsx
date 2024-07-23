import BaseDialog, { IBaseDialogProps } from "@/components/commons/BaseDialog";
import React from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface IDialogOption
  extends Omit<IBaseDialogProps, "okHandle" | "cancelHandle"> {
  okHandle?: (close: () => void) => void;
  cancelHandle?: (close: () => void) => void;
}

const useDiaLog = () => {
  const [dialogs, setDialogs] = useState<Record<string, React.ReactNode>>({});

  const dialog = {
    confirm: ({
      title = "Thông báo",
      content = "Nội dung thông báo",
      okHandle,
      cancelHandle,
      ...rest
    }: IDialogOption) => {
      const uuid = uuidv4();

      const close = () => {
        setDialogs((s) =>
          Object.keys(s).reduce((d: any, e) => {
            if (e !== uuid) d[e] = s[e];
            return d;
          }, {})
        );
      };

      setDialogs((s) => ({
        ...s,
        [uuid]: (
          <BaseDialog
            open={true}
            title={title}
            content={content}
            okHandle={() => {
              okHandle ? okHandle(close) : close();
            }}
            cancelHandle={() => {
              cancelHandle ? cancelHandle(close) : close();
            }}
            cancelButton={"Đóng"}
            okButton={"Đồng ý"}
            {...rest}
          />
        ),
      }));

      return close;
    },
  };
  const context = (
    <>
      {Object.keys(dialogs).map((i) => {
        const d = dialogs[i];
        return <React.Fragment key={i}>{d}</React.Fragment>;
      })}
    </>
  );

  return { dialog, context };
};
export default useDiaLog;
