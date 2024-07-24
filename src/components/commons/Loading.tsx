import { Backdrop, CircularProgress } from "@mui/material";

import useGlobalStore from "@/stores/globalStore";

export interface ILoadingProps {}

export default function Loading(_props: ILoadingProps) {
  const loading = useGlobalStore((s) => s.loading);
  return (
    <Backdrop
      sx={{
        color: "rgb(255, 102, 42)",
        background: "rgba(255, 255, 255, 0.41)",
        zIndex: 9999,
      }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export const loading =
  useGlobalStore.getState().setLoading || function (_boolean: boolean) {};
