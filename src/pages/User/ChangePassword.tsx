import authApi, { IFormChangePassword } from "@/api/auth";
import { loading } from "@/components/commons/Loading";
import { toasts } from "@/components/commons/Toast";
import { Password } from "@mui/icons-material";
import { Box, Button, Card, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export interface IChangePasswordProps {}

export default function ChangePassword(_props: IChangePasswordProps) {
  const [isChange, setIsChange] = useState<boolean>(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormChangePassword>({
    defaultValues: {
      password: "",
      currentPassword: "",
      passwordConfirmation: "",
    },
  });
  const defaultValues = useMemo(
    () => ({
      password: "",
      currentPassword: "",
      passwordConfirmation: "",
    }),
    []
  );
  const currentValues = useWatch({ control });

  useEffect(() => {
    setIsChange(!_.isEqual(defaultValues, currentValues));
  }, [currentValues, defaultValues]);

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess() {
      toasts.success("Cập nhật mật khẩu thành công");
      setIsChange(false);
    },
  });

  useEffect(() => {
    loading(isPending);
  }, [isPending]);

  const onSubmit = (data: IFormChangePassword) => {
    mutate(data);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-3xl">Đăng nhập và bảo mật</div>
      </div>

      <Card className="mt-4 p-4">
        <div className="flex gap-4 items-center text-xl">
          <div className="bg-white w-10 h-10 rounded-full shadow flex justify-center items-center">
            <Password />
          </div>
          Đổi mật khẩu
        </div>

        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Controller
              name="currentPassword"
              control={control}
              rules={{ required: "Yêu cầu bắt buộc có giá trị" }}
              render={({ field }) => (
                <div>
                  <label htmlFor="">Mật khẩu cũ*</label>
                  <TextField
                    error={!!errors.currentPassword}
                    helperText={
                      errors.currentPassword
                        ? errors.currentPassword.message
                        : ""
                    }
                    {...field}
                    variant="outlined"
                    fullWidth
                    type="password"
                  />
                </div>
              )}
            />

            <Controller
              rules={{ required: "Yêu cầu bắt buộc có giá trị" }}
              name="password"
              control={control}
              render={({ field }) => (
                <div>
                  <label htmlFor="">Mật khẩu mới*</label>
                  <TextField
                    {...field}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ""}
                    type="password"
                    variant="outlined"
                    fullWidth
                  />
                </div>
              )}
            />

            <Controller
              rules={{ required: "Yêu cầu bắt buộc có giá trị" }}
              name="passwordConfirmation"
              control={control}
              render={({ field }) => (
                <div>
                  <label htmlFor="">Nhập lại mật khẩu*</label>
                  <TextField
                    {...field}
                    error={!!errors.passwordConfirmation}
                    helperText={
                      errors.passwordConfirmation
                        ? errors.passwordConfirmation.message
                        : ""
                    }
                    type="password"
                    variant="outlined"
                    fullWidth
                  />
                </div>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                variant="contained"
                color="inherit"
                onClick={() => reset()}
              >
                Hủy
              </Button>
              <Button
                disabled={!isChange}
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ color: "white" }}
              >
                Lưu
              </Button>
            </div>
          </Box>
        </form>
      </Card>
    </div>
  );
}
