import authApi, { IResetPassword } from "@/api/auth";
import BaseTextField from "@/components/bases/BaseTextField";
import { loading } from "@/components/commons/Loading";
import { toasts } from "@/components/commons/Toast";
import useAuthStore from "@/stores/authStore";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import QueryString from "qs";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { shallow } from "zustand/shallow";

export interface IForgotPasswordProps {}

export default function ForgotPassword() {
  const location = useLocation();
  const queries = QueryString.parse(location.search.replace("?", ""));
  const [setToken, setUser] = useAuthStore(
    (s) => [s.setToken, s.setUser],
    shallow
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IResetPassword>();

  const { data, mutate, isPending } = useMutation({
    mutationFn: authApi.resetPassword,
  });

  useEffect(() => {
    if (data) {
      toasts.success("Đổi mật khẩu thành công");
      setUser(data?.user);
      setToken(data?.jwt);
    }
  }, [data, setToken, setUser]);

  useEffect(() => {
    loading(isPending);
  }, [isPending]);

  const onSubmit: SubmitHandler<IResetPassword> = ({
    password,
    passwordConfirmation,
  }: any) => {
    if (password === passwordConfirmation) {
      mutate({ password, passwordConfirmation, code: queries.code as string });
    } else {
      setError("passwordConfirmation", {
        message: "Nhắc lại mật khẩu không đúng",
      });
    }
  };

  return (
    <>
      <div className="font-bold text-2xl mb-4">Đặt lại mật khẩu</div>
      <Link to={"/auth/login"} className="text-orange-600">
        Đăng nhập ngay
      </Link>

      <form
        className="flex flex-col gap-8 mt-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <BaseTextField
          type="password"
          label="Mật khẩu"
          required
          autoFocus
          {...register("password", { required: "Password là bắt buộc" })}
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ""}
        />

        <BaseTextField
          type="password"
          label="Nhập lại mật khẩu"
          required
          autoFocus
          {...register("passwordConfirmation", {
            required: "Nhập lại mật khẩu là bắt buộc",
          })}
          error={!!errors.passwordConfirmation}
          helperText={
            errors.passwordConfirmation
              ? errors.passwordConfirmation.message
              : ""
          }
        />

        <Button type="submit" variant="contained" color="error">
          Gửi
        </Button>
      </form>
    </>
  );
}
