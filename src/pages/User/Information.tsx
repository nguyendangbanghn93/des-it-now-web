import userApi, { IFormUpdateUser } from "@/api/user";
import { loading } from "@/components/commons/Loading";
import { toasts } from "@/components/commons/Toast";
import useAuthStore from "@/stores/authStore";
import utils from "@/utils";
import { Close, PersonOutline } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  IconButton,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { shallow } from "zustand/shallow";

export interface IInformationProps {}

export default function Information(_props: IInformationProps) {
  const [user, refetchUser] = useAuthStore(
    (s) => [s.user, s.refetchUser],
    shallow
  );
  const [isChange, setIsChange] = useState<boolean>(false);

  const { control, reset, handleSubmit, setValue, watch } =
    useForm<IFormUpdateUser>({
      defaultValues: {
        fullname: user?.fullname || "",
        email: user?.email || "",
        phone: user?.phone || "",
        description: user?.description || "",
        avatar: user?.avatar || undefined,
      },
    });
  const defaultValues = useMemo(
    () => ({
      fullname: user?.fullname || "",
      email: user?.email || "",
      phone: user?.phone || "",
      description: user?.description || "",
      avatar: user?.avatar || undefined,
    }),
    [user]
  );
  const currentValues = useWatch({ control });

  useEffect(() => {
    setIsChange(!_.isEqual(defaultValues, currentValues));
  }, [currentValues, defaultValues]);

  const avatar = watch("avatar");
  const avatarShow = avatar
    ? _.get(avatar, "url")
      ? utils.getImageStrapi(avatar as IFileData)
      : URL.createObjectURL(avatar as File)
    : "";

  const { mutate, isPending } = useMutation({
    mutationFn: userApi.update,
    onSuccess() {
      toasts.success("Cập nhật thông tin user thành công");
      setIsChange(false);
      refetchUser();
    },
  });

  useEffect(() => {
    loading(isPending);
  }, [isPending]);

  const onSubmit = (data: IFormUpdateUser) => {
    mutate({ id: user?.id as number, data });
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-3xl">Tài khoản</div>
      </div>

      <Card className="mt-4 p-4">
        <div className="flex gap-4 items-center text-xl">
          <div className="bg-white w-10 h-10 rounded-full shadow flex justify-center items-center">
            <PersonOutline />
          </div>
          Thông tin cá nhân
        </div>

        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={2}>
            <div className="flex">
              <div className="relative cursor-pointer">
                <div className="absolute top-0 right-0 z-10 translate-x-1/2">
                  {avatar && (
                    <IconButton
                      color="default"
                      className={"!bg-gray-200 !bg-opacity-70 !p-1"}
                      onClick={() => setValue("avatar", null)}
                    >
                      <Close />
                    </IconButton>
                  )}
                </div>
                <Avatar src={avatarShow} className="!w-20 !h-20" />

                <input
                  className="absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target?.files?.[0];
                    console.log("🚀 ~ file: Information.tsx:82 ~ file:", file);
                    setValue("avatar", file);
                  }}
                  type="file"
                />
              </div>
            </div>

            <Controller
              name="fullname"
              control={control}
              render={({ field }) => (
                <div>
                  <label htmlFor="">Họ và tên</label>
                  <TextField {...field} variant="outlined" fullWidth />
                </div>
              )}
            />

            <Controller
              disabled
              name="email"
              control={control}
              render={({ field }) => (
                <div>
                  <label htmlFor="">Email</label>
                  <TextField
                    {...field}
                    type="email"
                    variant="outlined"
                    fullWidth
                    helperText={
                      <>
                        Please{" "}
                        <span className="text-orange-500">contact us</span> to
                        change your email
                      </>
                    }
                  />
                </div>
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <div>
                  <label htmlFor="">Phone</label>
                  <TextField
                    {...field}
                    type="tel"
                    variant="outlined"
                    fullWidth
                  />
                </div>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div>
                  <label htmlFor="">Mô tả bản thân</label>
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
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
