import { useLocation, useNavigate } from "react-router-dom";

import useAuthStore from "@/stores/authStore";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import http from "@/api/http";
import { useQuery } from "@tanstack/react-query";
import userApi from "@/api/user";

export interface IPrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: IPrivateRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, user, setUser, setRefetchUser] = useAuthStore(
    (s) => [s.token, s.user, s.setUser, s.setRefetchUser],
    shallow
  );

  const { data, refetch } = useQuery({
    queryKey: ["userApi.getMe", token],
    queryFn: () => userApi.getMe(token),
  });

  useEffect(() => {
    setRefetchUser(refetch);
  }, [refetch, setRefetchUser]);

  useEffect(() => {
    data && setUser(data);
  }, [data, setUser]);

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
