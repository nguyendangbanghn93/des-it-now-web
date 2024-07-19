import authApi from "@/api/auth";
import { LOGO } from "@/assets";
import BaseTextField from "@/components/BaseTextField";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

export interface IRegisterProps {}

type IRegisterFormInputs = {
  username: string;
  password: string;
  repeatPassword: string;
};

export default function Register(_props: IRegisterProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IRegisterFormInputs>();

  const { mutate } = useMutation({
    mutationFn: authApi.register,
    mutationKey: ["register"],
  });
  console.log(errors);

  const onSubmit: SubmitHandler<IRegisterFormInputs> = ({
    username,
    password,
    repeatPassword,
  }: IRegisterFormInputs) => {
    if (password === repeatPassword) {
      mutate({ username, password });
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

        <Button type="submit" variant="contained" color="error">
          Đăng ký
        </Button>
      </form>
    </>
  );
}
