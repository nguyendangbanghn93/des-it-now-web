import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

export interface IBaseDialogProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  open?: boolean;
  cancelHandle?: () => void;
  okHandle?: () => void;
  cancelButton?: React.ReactNode | string;
  okButton?: React.ReactNode | string;
}

export default function BaseDialog({
  title,
  content,
  open,
  cancelHandle,
  okHandle,
  cancelButton = "Đóng",
  okButton = "Đồng ý",
}: IBaseDialogProps) {
  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={!!open}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>{content}</DialogContent>
      <DialogActions>
        {typeof cancelButton === "string" ? (
          <Button variant="contained" color="inherit" onClick={cancelHandle}>
            {cancelButton}
          </Button>
        ) : (
          cancelButton
        )}

        {typeof okButton === "string" ? (
          <Button variant="contained" color="error" onClick={okHandle}>
            {okButton}
          </Button>
        ) : (
          okButton
        )}
      </DialogActions>
    </Dialog>
  );
}
