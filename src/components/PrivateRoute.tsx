import { useLocation, useNavigate } from "react-router-dom";

import useAuthStore from "@/stores/authStore";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import http from "@/api/http";

export interface IPrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: IPrivateRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, user] = useAuthStore((s) => [s.token, s.user], shallow);

  useEffect(() => {
    if (!token || !user) {
      navigate("/auth/login", {
        state: { backRoute: `${location.pathname}${location.search}` },
      });
    }
  }, [location.pathname, location.search, navigate, token, user]);

  http.defaults.headers.common["Authorization"] = token
    ? `Bearer ${token}`
    : null;

  return token ? children : null;
}
