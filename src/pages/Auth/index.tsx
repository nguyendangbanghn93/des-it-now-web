import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { AUTH, LOGO } from "@/assets";
import Login from "@/components/Login";
import Register from "@/components/Register";
import useAuthStore from "@/stores/authStore";
import { useEffect } from "react";

export interface IAuthPageProps {}

export default function AuthPage(_props: IAuthPageProps) {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) navigate(location?.state?.backRoute || "/");
  }, [location?.state?.backRoute, navigate, token]);

  return (
    <div className="flex min-h-svh">
      <div className="w-7/12 bg-purple-300">
        <img src={AUTH} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="w-6/12 bg-white flex justify-center">
        <div className="max-w-[500px] w-2/3 md:w-5/6 mt-60 ">
          <img src={LOGO} className="mb-8" />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
