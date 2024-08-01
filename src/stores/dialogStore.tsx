import React, { useEffect } from "react";

import _ from "lodash";
import { createWithEqualityFn } from "zustand/traditional";
import BaseDialog, { IBaseDialogProps } from "@/components/bases/BaseDialog";
import ReactDOM from "react-dom";

import { v4 as uuidv4 } from "uuid";
import { info } from "console";

interface IDialogState {
  dialogs: Record<string, JSX.Element>;
}

interface IDialogActions {
  setDialog: (_: IBaseDialogProps) => any;
}

type IDialogStore = IDialogState & IDialogActions;

const initialState: IDialogState = {
  dialogs: {},
};

const useDialogStore = createWithEqualityFn<IDialogStore>()((set) => ({
  ...initialState,
  setDialog({ title, content, ...rest }: IBaseDialogProps) {
    const uuid = uuidv4();
    const close = () =>
      set((s) => {
        const obj = { ...s.dialogs };
        delete obj[uuid];
        return { ...s, dialogs: obj };
      });
    set((s) => {
      const obj = { ...s.dialogs };
      obj[uuid] = ReactDOM.createPortal(
        <BaseDialog
          close={close}
          open={true}
          title={title}
          content={content}
          cancelButton={"Đóng"}
          okButton={"Đồng ý"}
          {...rest}
        />,
        document.getElementById("dialog-container") as HTMLElement
      );

      return { ...s, dialogs: obj };
    });

    return close;
  },
}));

export default useDialogStore;

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const dialogs = useDialogStore((s) => s.dialogs);
  return (
    <>
      <div id="dialog-container">{Object.values(dialogs)}</div>
      {children}
    </>
  );
};

export const dialog = {
  confirm({
    title = "Thông báo",
    content = "Nội dung",
    okButton = "Đồng ý",
    cancelButton = "Đóng",
    ...rest
  }: IBaseDialogProps) {
    return useDialogStore
      .getState()
      .setDialog({ title, content, okButton, cancelButton, ...rest });
  },
  info({
    title = "Thông báo",
    content = "Nội dung",
    okButton = "Đóng",
    cancelButton = <></>,
    ...rest
  }: IBaseDialogProps) {
    return useDialogStore
      .getState()
      .setDialog({ title, content, okButton, cancelButton, ...rest });
  },
};
