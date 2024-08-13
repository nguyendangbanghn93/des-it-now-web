import {
  Button,
  Chip,
  Drawer,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  CloseOutlined,
  AccessTime,
  EditOutlined,
  Cancel,
  Reviews,
  RateReview,
  CheckCircle,
} from "@mui/icons-material";

import dayjs from "dayjs";
import {
  DateFormat,
  EPosition,
  ERequestStatus,
  RequestStatus,
} from "@/utils/constants";
import utils from "@/utils";
import BaseDropdown from "@/components/bases/BaseDropdown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RequestStatusComponent from "@/pages/Requests/RequestStatusComponent";
import { useMutation } from "@tanstack/react-query";
import requestApi from "@/api/request";
import { loading } from "@/components/commons/Loading";
import useAuthStore from "@/stores/authStore";
import CreateRequest from "@/pages/Requests/CreateRequest";
import { toasts } from "@/components/commons/Toast";

export interface IRequestTableActionProps {
  data: IRequest;
  refetchTable: () => void;
  team: ITeam;
}

export default function RequestTableAction({
  data,
  refetchTable,
  team,
}: IRequestTableActionProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <IconButton onClick={() => setOpen(true)}>
        <VisibilityIcon />
      </IconButton>

      {open && (
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <ContentDetail
            team={team}
            refetchTable={refetchTable}
            data={data}
            onClose={() => setOpen(false)}
          />
        </Drawer>
      )}
    </div>
  );
}

const ContentDetail = ({
  data,
  onClose,
  refetchTable,
  team,
}: {
  data: IRequest;
  onClose: () => any;
  refetchTable: () => void;
  team: ITeam;
}) => {
  const [currentTime, setCurrentTime] = useState<dayjs.Dayjs>(dayjs());

  const user = useAuthStore((s) => s.user);

  const [openEdit, setOpenEdit] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: requestApi.update,
    onSuccess() {
      refetchTable();
    },
  });

  loading(mutation.isPending);

  const isCreator = useMemo(
    () => user?.id === data?.creator?.id,
    [data?.creator?.id, user?.id]
  );
  const isAssign = useMemo(
    () => user?.id === data?.assign?.id,
    [data?.assign?.id, user?.id]
  );
  const isAdmin = useMemo(
    () => user?.team.position === EPosition.admin,
    [user?.team.position]
  );

  const selectItemStatus = useMemo(
    () => ({
      doing: {
        icon: AccessTimeIcon,
        title: RequestStatus[ERequestStatus.doing],
        onClick() {
          mutation.mutate({
            id: data.id,
            data: { status: ERequestStatus.doing },
          });
        },
      },
      review: {
        icon: Reviews,
        title: RequestStatus[ERequestStatus.review],
        onClick() {
          mutation.mutate({
            id: data.id,
            data: { status: ERequestStatus.review },
          });
        },
      },
      needEdit: {
        icon: RateReview,
        title: RequestStatus[ERequestStatus.needEdit],
        onClick() {
          mutation.mutate({
            id: data.id,
            data: { status: ERequestStatus.needEdit },
          });
        },
      },
      done: {
        icon: CheckCircle,
        title: RequestStatus[ERequestStatus.done],
        onClick() {
          mutation.mutate({
            id: data.id,
            data: { status: ERequestStatus.done },
          });
        },
      },
      cancel: {
        icon: Cancel,
        title: RequestStatus[ERequestStatus.cancel],
        onClick() {
          mutation.mutate({
            id: data.id,
            data: { status: ERequestStatus.cancel },
          });
        },
      },
    }),
    [data.id, mutation]
  );

  const itemsChangeStatus: Record<ERequestStatus, any> = useMemo(
    () => ({
      [ERequestStatus.todo]: isAssign ? [selectItemStatus.doing] : [],
      [ERequestStatus.doing]: isAssign ? [selectItemStatus.review] : [],
      [ERequestStatus.review]:
        isCreator || isAdmin
          ? [selectItemStatus.needEdit, selectItemStatus.done]
          : [],
      [ERequestStatus.needEdit]: isAssign ? [selectItemStatus.doing] : [],
      [ERequestStatus.done]: [],
      [ERequestStatus.cancel]: [],
    }),
    [isAdmin, isAssign, isCreator, selectItemStatus]
  );

  if (isAdmin || isCreator) {
    const cancelItem = {
      icon: Cancel,
      title: RequestStatus[ERequestStatus.cancel],
      onClick() {
        mutation.mutate({
          id: data.id,
          data: { status: ERequestStatus.cancel },
        });
      },
    };

    itemsChangeStatus.todo.push(cancelItem);
    itemsChangeStatus.doing.push(cancelItem);
    itemsChangeStatus.needEdit.push(cancelItem);
    itemsChangeStatus.review.push(cancelItem);
  }

  const startDate = useMemo(
    () => data?.logs?.find((d) => d.status === ERequestStatus.doing)?.updatedAt,
    [data?.logs]
  );

  const endDate = useMemo(
    () =>
      data?.logs?.find((d) =>
        [ERequestStatus.done, ERequestStatus.cancel].includes(
          d.status as ERequestStatus
        )
      ),
    [data?.logs]
  );

  useEffect(() => {
    if (startDate && !endDate) {
      const loop = setInterval(() => {
        setCurrentTime(dayjs());
      }, 1000);
      return () => clearInterval(loop);
    }
  }, [endDate, startDate]);

  return (
    <div className="w-[500px] p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="font-bold">Yêu cầu: #{data.id}</div>
        <IconButton onClick={onClose}>
          <CloseOutlined />
        </IconButton>
      </div>
      {openEdit && (
        <CreateRequest
          refetchRequest={refetchTable}
          team={team}
          open={openEdit}
          initValue={data}
          handleClose={() => setOpenEdit(false)}
        />
      )}

      <div className="flex justify-between items-center">
        <div className="font-bold">Mô tả yêu cầu</div>
        <div className="flex gap-4">
          {startDate && !endDate && (
            <Chip
              size="small"
              label={
                <div className="flex gap-2 items-center text-white">
                  <AccessTime fontSize={"small"} />
                  {utils.getDuration(startDate, currentTime.toDate())}
                </div>
              }
              variant="filled"
              color="secondary"
            />
          )}
          <BaseDropdown
            items={itemsChangeStatus[data.status as ERequestStatus]}
          >
            {RequestStatusComponent[data.status as ERequestStatus]}
          </BaseDropdown>
          {(isAdmin || isCreator) &&
            ![ERequestStatus.done, ERequestStatus.cancel].includes(
              data.status as ERequestStatus
            ) && (
              <Button
                sx={{ borderRadius: 8 }}
                size="small"
                className="flex gap-2"
                color="inherit"
              >
                <div
                  className="text-sm text-gray-500"
                  onClick={() => setOpenEdit(true)}
                >
                  <EditOutlined fontSize="small" />
                  Sửa
                </div>
              </Button>
            )}
        </div>
      </div>

      <div className="">
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "none", border: "1px solid #ddd" }}
        >
          <Table sx={{ minWidth: 350 }} size="small">
            <TableBody>
              {[
                {
                  label: "Người tạo",
                  value: data?.creator?.fullname || data?.creator?.username,
                },
                {
                  label: "Loại sản phẩm",
                  value: data?.data?.productType?.name,
                },
                {
                  label: "Loại thiết kế",
                  value: data?.data?.designType?.name,
                },
                {
                  label: "Số lượng mẫu",
                  value: data.quantity,
                },
                {
                  label: "Giá thiết kế",
                  value: utils.formatMoney(data.totalPrice),
                },
                {
                  label: "Người thiết kế",
                  value: data?.assign?.username,
                },
                {
                  label: "Thời gian tạo",
                  value: dayjs(data.createdAt).format(DateFormat.fullDate),
                },
              ].map((r, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ padding: 1.5 }} component={"th"}>
                    <span className="text-gray-500">{r.label}</span>
                  </TableCell>
                  <TableCell sx={{ padding: 1.5 }} component={"th"}>
                    {r.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="font-bold">Ảnh thiết kế</div>

      <div className="">
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "none", border: "1px solid #ddd" }}
        >
          <Table sx={{ minWidth: 350 }} size="small">
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell>Ảnh</TableCell>
                <TableCell>Tên file</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.photos?.map((p, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ padding: 1.5 }} component={"th"}>
                    {p && (
                      <img
                        className="w-20 h-20 rounded-lg"
                        src={utils.getImageStrapi(p)}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ padding: 1.5 }} component={"th"}>
                    {p.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="font-bold">Yêu cầu thêm</div>

      <div className="flex border shadow rounded-lg items-center">
        <div className="p-4 pr-6 whitespace-nowrap text-gray-500">Ghi chú</div>
        <div className="p-4 ">{data.note}</div>
      </div>

      <div className="text-right mt-8">
        <Button
          variant="contained"
          color="secondary"
          sx={{ color: "white" }}
          onClick={() => {
            toasts.info("Coming soon");
          }}
        >
          Phản hồi
        </Button>
      </div>
    </div>
  );
};
