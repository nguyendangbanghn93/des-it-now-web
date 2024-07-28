import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { forwardRef, useImperativeHandle, useState } from "react";

export interface IBaseDialogProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  open?: boolean;
  cancelHandle?: () => void;
  okHandle?: () => void;
  cancelButton?: React.ReactNode | string;
  okButton?: React.ReactNode | string;
}

function BaseDialog(_props: any, ref: any) {
  const [config, setConfig] = useState<IBaseDialogProps>({
    title: "Thông báo",
    content: "Nội dung",
    cancelButton: "Đóng",
    okButton: "Đồng ý",
  });
  const [open, setOpen] = useState<boolean>(false);
  useImperativeHandle(
    ref,
    () => ({
      open: (config: IBaseDialogProps) => {
        setConfig((s) => ({ ...s, config }));
      },
      close: () => setOpen(false),
    }),
    [setConfig]
  );
  if (!open) {
    return null;
  }
  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={!!open}
    >
      <DialogTitle>{config.title}</DialogTitle>
      <DialogContent dividers>{config.content}</DialogContent>
      <DialogActions>
        {typeof config.cancelButton === "string" ? (
          <Button
            variant="contained"
            color="inherit"
            onClick={config.cancelHandle}
          >
            {config.cancelButton}
          </Button>
        ) : (
          config.cancelButton
        )}

        {typeof config.okButton === "string" ? (
          <Button variant="contained" color="error" onClick={config.okHandle}>
            {config.okButton}
          </Button>
        ) : (
          config.okButton
        )}
      </DialogActions>
    </Dialog>
  );
}
export default forwardRef(BaseDialog);
