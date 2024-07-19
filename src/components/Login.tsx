import { LOGO } from "@/assets";
import BaseTextField from "@/components/BaseTextField";
import { Button } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

export interface ILoginProps {}

type ILoginFormInputs = {
  username: string;
  password: string;
};

export default function Login(_props: ILoginProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInputs>();

  const onSubmit: SubmitHandler<ILoginFormInputs> = (data: any) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-svh">
      <div className="w-7/12 bg-purple-300"></div>
      <div className="w-6/12 bg-white flex justify-center">
        <div className="max-w-[500px] w-2/3 md:w-5/6 mt-60 ">
          <img src={LOGO} className="mb-8" />

          <div className="font-bold text-2xl mb-4">Đăng nhập</div>

          <div className="flex gap-2">
            <span className="text-gray-300">Bạn chưa có tài khoản?</span>
            <Link to={"/register"} className="text-orange-600">
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

            <div className="text-orange-500">Quên mật khẩu</div>
          </form>
        </div>
      </div>
    </div>
  );
}
