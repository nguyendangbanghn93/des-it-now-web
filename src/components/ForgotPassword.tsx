import authApi, { IForgotPassword } from "@/api/auth";
import BaseTextField from "@/components/bases/BaseTextField";
import { loading } from "@/components/commons/Loading";
import { toasts } from "@/components/commons/Toast";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export interface IForgotPasswordProps {}

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPassword>();

  const { data, mutate, isPending } = useMutation({
    mutationFn: authApi.forgotPassword,
  });

  useEffect(() => {
    if (data) {
      toasts.success("Vui lòng kiểm tra email để đặt lại mật khẩu.");
    }
  }, [data]);

  useEffect(() => {
    loading(isPending);
  }, [isPending]);

  const onSubmit: SubmitHandler<IForgotPassword> = ({ email }: any) => {
    mutate({ email });
  };

  return (
    <>
      <div className="font-bold text-2xl mb-4">Quên mật khẩu</div>
      <Link to={"/auth/login"} className="text-orange-600">
        Đăng nhập ngay
      </Link>

      <form
        className="flex flex-col gap-8 mt-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <BaseTextField
          type="email"
          label="Email"
          required
          autoFocus
          {...register("email", { required: "Email là bắt buộc" })}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ""}
        />

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          sx={{ color: "white" }}
        >
          Gửi
        </Button>
      </form>
    </>
  );
}
