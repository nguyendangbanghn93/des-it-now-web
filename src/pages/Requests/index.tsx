import {
  Button,
  Card,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
} from "@mui/material";

import requestApi, {
  ESortRequest,
  IFindRequestParams,
  sortOptions,
} from "@/api/request";
import teamApi from "@/api/team";
import BaseTextField from "@/components/bases/BaseTextField";
import dataHelper from "@/helpers/dataHelper";
import useDiaLog from "@/hooks/useDialog";
import CreateRequest from "@/pages/Requests/CreateRequest";
import RequestStatusComponent from "@/pages/Requests/RequestStatusComponent";
import RequestTableAction from "@/pages/Requests/RequestTableAction";
import utils from "@/utils";
import { DateFormat, ERequestStatus } from "@/utils/constants";
import { FilterList } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import _ from "lodash";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface Column {
  id: "name" | "code" | "population" | "size" | "density" | any;
  label: string;
  minWidth?: number;
  align?: "right";
  render?: (val: any, row: IRequest, ind: number) => React.ReactNode;
}

export interface IRequestsProps {}

export default function Requests(_props: IRequestsProps) {
  const { dialog, context } = useDiaLog();
  const [openCreateRequest, setOpenCreateRequest] = useState(false);

  const [params, setParams] = useState<IFindRequestParams>({
    status: "",
    pagination: {
      page: 1,
      pageSize: 10,
    },
    sort: ESortRequest["createdAt:desc"],
  });

  const columns: readonly Column[] = [
    {
      id: "photos",
      label: "Ảnh",
      render(val) {
        return (
          val && (
            <img
              className="w-20 h-20 rounded-lg"
              src={utils.getImageStrapi(val[0])}
            />
          )
        );
      },
    },
    { id: "id", label: "Mã yêu cầu" },
    {
      id: "createdAt",
      label: "Thời gian tạo",
      render: (value: number) => dayjs(value).format(DateFormat.fullDate),
    },
    {
      id: "productType",
      label: "Loại sản phẩm",
      render: (value: number) => dataHelper.getProduct(value)?.name || value,
    },
    {
      id: "designType",
      label: "Loại thiết kế",
      render: (value: number) => dataHelper.getDesign(value)?.name || value,
    },
    {
      id: "status",
      label: "Trạng thái",
      render: (value: ERequestStatus) => {
        return RequestStatusComponent[value] || value;
      },
    },
    {
      id: "action",
      label: "Hành động",
      render: (_, row) => (
        <RequestTableAction refetchTable={refetchRequest} data={row} />
      ),
    },
  ];

  const { data: team } = useQuery({
    queryFn: teamApi.getMyTeam,
    queryKey: ["getMyTeam"],
  });
  const { control, handleSubmit } = useForm({
    defaultValues: {
      sort: params.sort,
      search: params.search,
    },
  });

  const { data: dataRequests, refetch: refetchRequest } = useQuery({
    queryFn: () => requestApi.find(params),
    queryKey: [
      "requestApi.find",
      ...Object.values(params.pagination),
      params.search,
      params.sort,
      params.status,
    ],
  });

  const addRequestClick = () => {
    if (!team) {
      dialog.confirm({
        content:
          "Bạn không thuộc team nào vui lòng liên hệ với người khác để tham gia team hoặc tạo 1 team mới.",
        okButton: "Tạo team",
        okHandle(close) {
          // Tạo team
          close();
        },
      });
    } else {
      setOpenCreateRequest(true);
    }
  };

  const onSearch: SubmitHandler<{ sort?: ESortRequest; search?: string }> = (
    data
  ) => {
    setParams((s) => ({ ...s, sort: data.sort, search: data.search }));
  };

  return (
    <>
      <CreateRequest
        refetchRequest={refetchRequest}
        open={openCreateRequest}
        handleClose={() => setOpenCreateRequest(false)}
      />
      {context}
      <div className="container mx-auto mt-20 p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="text-3xl">Danh sách yêu cầu</div>
          <Button
            onClick={addRequestClick}
            startIcon={<AddIcon />}
            variant="contained"
            color="secondary"
            sx={{ color: "white" }}
          >
            Thêm
          </Button>
        </div>
        <Card className="p-4">
          <Tabs
            className="border-b"
            value={params.status}
            onChange={(_, v) => {
              setParams((s) => ({ ...s, status: v }));
            }}
          >
            {[
              { label: "All", value: "" },
              { label: "Cần làm", value: "todo" },
              { label: "Đang làm", value: "doing" },
              { label: "Đang review", value: "review" },
              { label: "Cần sửa", value: "needEdit" },
              { label: "Hoàn thành", value: "done" },
            ].map((item) => {
              return (
                <Tab label={item.label} key={item.value} value={item.value} />
              );
            })}
          </Tabs>

          <form className="flex gap-4 mt-4" onSubmit={handleSubmit(onSearch)}>
            <Controller
              control={control}
              name="sort"
              render={({ field }) => (
                <Select {...field} className="w-[150px]" size="small">
                  {sortOptions.map((item, i) => (
                    <MenuItem key={i} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              control={control}
              name="search"
              render={({ field }) => (
                <BaseTextField
                  {...field}
                  placeholder="Tìm id hoặc tên yêu cầu"
                  wrapClass="w-[300px]"
                />
              )}
            />

            <Button
              startIcon={<FilterList />}
              variant="contained"
              color="secondary"
              sx={{ color: "white" }}
              type="submit"
            >
              Lọc
            </Button>
          </form>
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
                    {dataRequests?.data?.map((row: IRequest, ind: number) => {
                      return (
                        <TableRow
                          component="tr"
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
                          onDoubleClick={() => {
                            console.log("🚀 ~ {data.map ~ row:", row);
                          }}
                        >
                          {columns.map((column) => {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.render
                                  ? column.render(
                                      _.get(row, column.id),
                                      row,
                                      ind
                                    )
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
              {dataRequests?.meta.pagination && (
                <TablePagination
                  rowsPerPageOptions={[
                    { label: "10", value: 10 },
                    { label: "20", value: 20 },
                    { label: "25", value: 25 },
                  ]}
                  component="div"
                  count={dataRequests?.meta.pagination.pageCount}
                  rowsPerPage={dataRequests?.meta.pagination?.pageSize || 10}
                  page={dataRequests?.meta.pagination.page - 1}
                  onRowsPerPageChange={(e) => {
                    setParams((s) => ({
                      ...s,
                      pagination: {
                        ...s.pagination,
                        pageSize: e.target.value as unknown as number,
                      },
                    }));
                  }}
                  onPageChange={(_e, page: number) => {
                    setParams((s) => ({
                      ...s,
                      pagination: { ...s.pagination, page: page },
                    }));
                  }}
                />
              )}
            </Paper>
          </div>
        </Card>
      </div>
    </>
  );
}
