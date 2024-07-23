import { SubmitHandler, useForm } from "react-hook-form";

import BaseTextField from "@/components/bases/BaseTextField";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import authApi from "@/api/auth";
import { loading } from "@/components/commons/Loading";
import { shallow } from "zustand/shallow";
import { toasts } from "@/components/commons/Toast";
import useAuthStore from "@/stores/authStore";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

export interface ILoginProps {}

type ILoginFormInputs = {
  username: string;
  password: string;
};

export default function Login(_props: ILoginProps) {
  const [setToken, setUser] = useAuthStore(
    (s) => [s.setToken, s.setUser],
    shallow
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInputs>();

  const { data, mutate, isPending } = useMutation({
    mutationFn: authApi.login,
  });

  useEffect(() => {
    if (data) {
      toasts.success("Đăng ký thành công");
      setUser(data?.user);
      setToken(data?.jwt);
    }
  }, [data, setToken, setUser]);

  useEffect(() => {
    loading(isPending);
  }, [isPending]);

  const onSubmit: SubmitHandler<ILoginFormInputs> = (data: any) => mutate(data);

  return (
    <>
      <div className="font-bold text-2xl mb-4">Đăng nhập</div>

      <div className="flex gap-2">
        <span className="text-gray-300">Bạn chưa có tài khoản?</span>
        <Link to={"/auth/register"} className="text-orange-600">
          Đăng ký ngay
        </Link>
      </div>

      <form
        className="flex flex-col gap-8 mt-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <BaseTextField
          id="username"
          label="Email/Username"
          required
          autoFocus
          {...register("username", {
            required: "Email/username là bắt buộc",
          })}
          error={!!errors.username}
          helperText={errors.username ? errors.username.message : ""}
        />
        <BaseTextField
          id="password"
          type="password"
          label="Password"
          required
          autoFocus
          {...register("password", { required: "Password là bắt buộc" })}
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ""}
        />

        <Button type="submit" variant="contained" color="error">
          Đăng nhập
        </Button>

        <Link
          to={"https://zalo.me/2388737910481254550"}
          className="text-orange-500"
        >
          Quên mật khẩu
        </Link>
      </form>
    </>
  );
}
