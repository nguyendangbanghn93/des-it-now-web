import teamApi from "@/api/team";
import userApi, { ICreateUser } from "@/api/user";
import { loading } from "@/components/commons/Loading";
import { dialog } from "@/stores/dialogStore";
import { PeopleOutline } from "@mui/icons-material";
import { Box, Button, Card, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export interface ITeamProps {}

export default function Team(_props: ITeamProps) {
  const [isChange, setIsChange] = useState<boolean>(false);
  const { data: team } = useQuery({
    queryFn: teamApi.getMyTeam,
    queryKey: ["teamApi.getMyTeam"],
  });

  console.log("🚀 ~ file: Team.tsx:28 ~ team:", team);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateUser>({
    defaultValues: {
      email: "",
    },
  });
  const defaultValues = useMemo(
    () => ({
      email: "",
    }),
    []
  );
  const currentValues = useWatch({ control });

  useEffect(() => {
    setIsChange(!_.isEqual(defaultValues, currentValues));
  }, [currentValues, defaultValues]);

  const { mutate, isPending } = useMutation({
    mutationFn: userApi.create,
    onSuccess() {
      dialog.info({
        content:
          "Tạo tài khoản thành công, Tài khoản và mật khẩu đã được gửi về email",
      });
      setIsChange(false);
    },
  });

  useEffect(() => {
    loading(isPending);
  }, [isPending]);

  const onSubmit = (data: ICreateUser) => {
    mutate(data);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-3xl">Đội nhóm</div>
      </div>

      <Card className="mt-4 p-4">
        <div className="flex gap-4 items-center text-xl">
          <div className="bg-white w-10 h-10 rounded-full shadow flex justify-center items-center">
            <PeopleOutline />
          </div>
          Thêm thành viên quản lý tài khoản
        </div>

        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Yêu cầu bắt buộc có giá trị" }}
              render={({ field }) => (
                <div>
                  <label htmlFor="">Email*</label>
                  <TextField
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ""}
                    {...field}
                    variant="outlined"
                    fullWidth
                    type="email"
                  />
                </div>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                disabled={!isChange}
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ color: "white" }}
              >
                Thêm tài khoản
              </Button>
            </div>
          </Box>
        </form>
      </Card>
    </div>
  );
}
