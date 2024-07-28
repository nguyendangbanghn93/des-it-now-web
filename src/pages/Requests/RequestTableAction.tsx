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
import { CloseOutlined, AccessTime, EditOutlined } from "@mui/icons-material";

import dayjs from "dayjs";
import { DateFormat, ERequestStatus, RequestStatus } from "@/utils/constants";
import utils from "@/utils";
import dataHelper from "@/helpers/dataHelper";
import BaseDropdown from "@/components/bases/BaseDropdown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RequestStatusComponent from "@/pages/Requests/RequestStatusComponent";
import { useMutation } from "@tanstack/react-query";
import requestApi from "@/api/request";
import { loading } from "@/components/commons/Loading";

export interface IRequestTableActionProps {
  data: IRequest;
  refetchTable: () => void;
}

export default function RequestTableAction({
  data,
  refetchTable,
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
}: {
  data: IRequest;
  onClose: () => any;
  refetchTable: () => void;
}) => {
  const [currentTime, setCurrentTime] = useState<dayjs.Dayjs>(dayjs());

  const mutation = useMutation({
    mutationFn: requestApi.update,
    onSuccess() {
      refetchTable();
    },
  });

  loading(mutation.isPending);

  const itemsChangeStatus: Record<ERequestStatus, any> = useMemo(
    () => ({
      [ERequestStatus.todo]: [
        {
          icon: AccessTimeIcon,
          title: RequestStatus[ERequestStatus.doing],
          onClick() {
            mutation.mutate({
              id: data.id,
              data: { status: ERequestStatus.doing },
            });
          },
        },
      ],
      [ERequestStatus.doing]: [
        {
          icon: AccessTimeIcon,
          title: RequestStatus[ERequestStatus.review],
          onClick() {
            mutation.mutate({
              id: data.id,
              data: { status: ERequestStatus.review },
            });
          },
        },
      ],
      [ERequestStatus.review]: [
        {
          icon: AccessTimeIcon,
          title: RequestStatus[ERequestStatus.needEdit],
          onClick() {
            mutation.mutate({
              id: data.id,
              data: { status: ERequestStatus.needEdit },
            });
          },
        },
        {
          icon: AccessTimeIcon,
          title: RequestStatus[ERequestStatus.done],
          onClick() {
            mutation.mutate({
              id: data.id,
              data: { status: ERequestStatus.done },
            });
          },
        },
      ],
      [ERequestStatus.needEdit]: [
        {
          icon: AccessTimeIcon,
          title: RequestStatus[ERequestStatus.doing],
          onClick() {
            mutation.mutate({
              id: data.id,
              data: { status: ERequestStatus.doing },
            });
          },
        },
      ],
      [ERequestStatus.done]: undefined,
    }),
    [data.id, mutation]
  );

  switch (data.status) {
    case ERequestStatus.todo:
      itemsChangeStatus;
      break;

    default:
      break;
  }

  useEffect(() => {
    const loop = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(loop);
  }, []);

  return (
    <div className="w-[500px] p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="font-bold">Yêu cầu: #${data.id}</div>
        <IconButton onClick={onClose}>
          <CloseOutlined />
        </IconButton>
      </div>

      <div className="flex justify-between items-center">
        <div className="font-bold">Mô tả yêu cầu</div>
        <div className="flex gap-4">
          <Chip
            size="small"
            label={
              <div className="flex gap-2 items-center">
                <AccessTime fontSize={"small"} />
                {dayjs(currentTime).format(DateFormat.fullTime)}
              </div>
            }
            variant="filled"
            color="secondary"
          />
          <BaseDropdown
            items={itemsChangeStatus[data.status as ERequestStatus]}
          >
            {RequestStatusComponent[data.status as ERequestStatus]}
          </BaseDropdown>
          <Button
            sx={{ borderRadius: 8 }}
            size="small"
            className="flex gap-2"
            color="inherit"
          >
            <div className="text-sm text-gray-500">
              <EditOutlined fontSize="small" />
              Sửa
            </div>
          </Button>
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
                  value:
                    dataHelper.getDesign(data.productType)?.name ||
                    data.productType,
                },
                {
                  label: "Loại thiết kế",
                  value:
                    dataHelper.getDesign(data.designType)?.name ||
                    data.designType,
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
                  value: "Nguyễn Đăng Bằng",
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
        <Button variant="contained" color="secondary" sx={{ color: "white" }}>
          Phản hồi
        </Button>
      </div>
    </div>
  );
};
