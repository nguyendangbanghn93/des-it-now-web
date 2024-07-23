import { Alert, Snackbar } from "@mui/material";

import { shallow } from "zustand/shallow";
import useGlobalStore from "@/stores/globalStore";

export interface IToastsProps {}

export default function Toasts(_props: IToastsProps) {
  const [toast, setToast] = useGlobalStore(
    (s) => [s.toast, s.setToast],
    shallow
  );
  const vertical = "top";
  const horizontal = "center";
  const handleClose = () => {
    setToast({ open: false, message: "", type: undefined });
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={toast.open}
      autoHideDuration={2000}
      onClose={handleClose}
      key={vertical + horizontal}
      children={
        toast.open ? (
          <Alert
            onClose={handleClose}
            severity={toast.type}
            variant="standard"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        ) : undefined
      }
    />
  );
}
const setToast = useGlobalStore.getState().setToast;

export const toasts = {
  close: () => setToast({ open: false, message: "", type: undefined }),
  success: (m: string) => setToast({ open: true, message: m, type: "success" }),
  info: (m: string) => setToast({ open: true, message: m, type: "info" }),
  warning: (m: string) => setToast({ open: true, message: m, type: "warning" }),
  error: (m: string) => setToast({ open: true, message: m, type: "error" }),
};
