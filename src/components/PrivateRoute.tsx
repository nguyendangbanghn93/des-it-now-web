import { useLocation, useNavigate } from "react-router-dom";

import useAuthStore from "@/stores/authStore";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";

export interface IPrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: IPrivateRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, user] = useAuthStore((s) => [s.token, s.user], shallow);
  console.log("🚀 ~ PrivateRoute ~ user:", user)

  useEffect(() => {
    if (!token || !user)
      navigate("/auth/login", {
        state: { backRoute: `${location.pathname}${location.search}` },
      });
  }, [location.pathname, location.search, navigate, token, user]);
  return <>{children}</>;
}
