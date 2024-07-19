import { LOGO } from "@/assets";
import Login from "@/components/Login";
import Register from "@/components/Register";
import { Route, Routes } from "react-router-dom";
export interface IAuthPageProps {}

export default function AuthPage(_props: IAuthPageProps) {
  return (
    <div className="flex min-h-svh">
      <div className="w-7/12 bg-purple-300"></div>
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
