import teamApi from "@/api/team";
import userApi, { ICreateUser } from "@/api/user";
import BaseDropdown from "@/components/bases/BaseDropdown";
import { loading } from "@/components/commons/Loading";
import { toasts } from "@/components/commons/Toast";
import useAuthStore from "@/stores/authStore";
import { dialog } from "@/stores/dialogStore";
import utils from "@/utils";
import { EPosition, Position } from "@/utils/constants";
import { Delete, MoreHoriz, PeopleOutline } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right";
  render?: (val: any, row: IMember, ind: number) => React.ReactNode;
}

export interface ITeamProps {}

export default function Team(_props: ITeamProps) {
  const user = useAuthStore((s) => s.user);

  const isAdmin = useMemo(
    () => user?.team?.position === EPosition.admin,
    [user?.team?.position]
  );

  const [isChange, setIsChange] = useState<boolean>(false);
  const { data: team, refetch } = useQuery({
    queryFn: teamApi.getMyTeam,
    queryKey: ["teamApi.getMyTeam"],
  });

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
          "Tài khoản đã được thêm vào nhóm, Kiểm tra thông tin đăng nhập trong email",
      });
      refetch();
      setIsChange(false);
    },
  });

  const { mutate: mutateKickMember, isPending: isPendingKickMember } =
    useMutation({
      mutationFn: teamApi.kick,
      onSuccess() {
        dialog.info({
          content: "Xóa tài khoản khỏi nhóm thành công",
        });
      },
    });

  useEffect(() => {
    loading(isPending || isPendingKickMember);
  }, [isPending, isPendingKickMember]);

  const onSubmit = (data: ICreateUser) => {
    mutate(data);
  };

  const columns: readonly Column[] = [
    {
      id: "user",
      label: "Tên",
      render(user: IUser) {
        return (
          <div className="flex gap-4 items-center">
            <Avatar src={utils.getImageStrapi(user?.avatar as IFileData)}>
              {(user?.fullname || user?.username)?.substring(0, 1)}
            </Avatar>{" "}
            {user.fullname || user.username}
          </div>
        );
      },
    },
    {
      id: "position",
      label: "Quyền",
      render(val: EPosition) {
        return Position?.[val] as string;
      },
    },
    {
      id: "action",
      label: "",
      render(_, member: IMember) {
        return (
          <>
            <BaseDropdown
              items={[
                {
                  icon: Delete,
                  title: "Xóa khỏi nhóm",
                  onClick: function (): void {
                    if (
                      member.position === EPosition.admin &&
                      (team?.members?.filter(
                        (m) => m.position === EPosition.admin
                      )?.length as number) <= 1
                    ) {
                      return toasts.error("Team phải có ít nhất 1 admin");
                    }
                    mutateKickMember(member?.user?.id as unknown as string);
                  },
                },
              ]}
            >
              <IconButton>
                <MoreHoriz />
              </IconButton>
            </BaseDropdown>
          </>
        );
      },
    },
  ];

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
                    className={`${!isAdmin ? "opacity-40" : ""}`}
                    disabled={!isAdmin}
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

      <div className="mt-4">
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {team?.members?.map((row: IMember, ind: number) => {
                  return (
                    <TableRow
                      component="tr"
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={ind}
                      onDoubleClick={() => {
                        console.log("🚀 ~ {data.map ~ row:", row);
                      }}
                    >
                      {columns.map((column) => {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.render
                              ? column.render(_.get(row, column.id), row, ind)
                              : _.get(row, column.id)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
}
