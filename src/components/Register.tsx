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
import validator from "@/utils/validator";

export interface IRegisterProps {}

type IRegisterFormInputs = {
  email: string;
  password: string;
  repeatPassword: string;
};

export default function Register(_props: IRegisterProps) {
  const [setToken, setUser] = useAuthStore(
    (s) => [s.setToken, s.setUser],
    shallow
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IRegisterFormInputs>();

  const { data, mutate, isPending } = useMutation({
    mutationFn: authApi.register,
  });

  useEffect(() => {
    if (data) {
      toasts.success("Đăng ký thành công");
      setUser(data.user);
      setToken(data.jwt);
    }
  }, [data, setToken, setUser]);

  useEffect(() => {
    loading(isPending);
  }, [isPending]);

  const onSubmit: SubmitHandler<IRegisterFormInputs> = ({
    email,
    password,
    repeatPassword,
  }: IRegisterFormInputs) => {
    if (password === repeatPassword) {
      mutate({ identifier: email, password });
    } else {
      setError("repeatPassword", { message: "Nhắc lại mật khẩu không đúng" });
    }
  };

  return (
    <>
      <div className="font-bold text-2xl mb-4">Đăng ký</div>

      <div className="flex gap-2">
        <span className="text-gray-300">Bạn đã có tài khoản?</span>
        <Link to={"/auth/login"} className="text-orange-600">
          Đăng nhập ngay
        </Link>
      </div>

      <form
        className="flex flex-col gap-8 mt-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <BaseTextField
          label="Email"
          required
          autoFocus
          {...register("email", {
            required: "Email là bắt buộc",
            validate: (value: string) => validator.email(value) || true,
          })}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ""}
        />
        <BaseTextField
          type="password"
          label="Password"
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
          {...register("repeatPassword", {
            required: "Nhập lại mật khẩu là bắt buộc",
          })}
          error={!!errors.repeatPassword}
          helperText={
            errors.repeatPassword ? errors.repeatPassword.message : ""
          }
        />

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          sx={{ color: "#fff" }}
        >
          Đăng ký
        </Button>
      </form>
    </>
  );
}
