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
  close?: () => void;
}

export default function BaseDialog({
  title,
  content,
  open,
  cancelHandle,
  okHandle,
  close,
  cancelButton = "Đóng",
  okButton = "Đồng ý",
}: IBaseDialogProps) {
  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { maxWidth: "80vw", maxHeight: "80vh" } }}
      maxWidth="xs"
      open={!!open}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>{content}</DialogContent>
      <DialogActions>
        {typeof cancelButton === "string" ? (
          <Button
            variant="contained"
            color="inherit"
            onClick={() => {
              cancelHandle?.();
              close?.();
            }}
          >
            {cancelButton}
          </Button>
        ) : (
          cancelButton
        )}

        {typeof okButton === "string" ? (
          <Button
            variant="contained"
            color="secondary"
            sx={{ color: "white" }}
            onClick={() => {
              okHandle?.();
              close?.();
            }}
          >
            {okButton}
          </Button>
        ) : (
          okButton
        )}
      </DialogActions>
    </Dialog>
  );
}
