import { Backdrop, CircularProgress } from "@mui/material";

import useGlobalStore from "@/stores/globalStore";

export interface ILoadingProps {}

export default function Loading(_props: ILoadingProps) {
  const loading = useGlobalStore((s) => s.loading);
  return (
    <Backdrop
      sx={{
        color: "#fff",
        background: "#dddddd",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export const loading =
  useGlobalStore.getState().setLoading || function (_boolean: boolean) {};
