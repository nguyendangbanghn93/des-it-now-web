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
import CreateRequest from "@/pages/Requests/CreateRequest";
import RequestStatusComponent from "@/pages/Requests/RequestStatusComponent";
import RequestTableAction from "@/pages/Requests/RequestTableAction";
import utils from "@/utils";
import { DateFormat, ERequestStatus, RequestStatus } from "@/utils/constants";
import { FilterList } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { dialog } from "@/stores/dialogStore";
import { loading } from "@/components/commons/Loading";
import { useQueryParams } from "@/hooks/useQueryParams";

interface Column {
  id: "name" | "code" | "population" | "size" | "density" | any;
  label: string;
  minWidth?: number;
  align?: "right";
  render?: (val: any, row: IRequest, ind: number) => React.ReactNode;
}

export interface IRequestsProps {}

export default function Requests(_props: IRequestsProps) {
  const location = useLocation();

  const [queries, setQueries] = useQueryParams<IFindRequestParams>({
    status: "",
    page: 1,
    pageSize: 10,
    sort: ESortRequest["createdAt:desc"],
    search: "",
  });

  const [openCreateRequest, setOpenCreateRequest] = useState(false);

  const state = location.state as { create?: boolean };

  useEffect(() => {
    if (state?.create) {
      setOpenCreateRequest(true);
    }
  }, [state?.create]);

  const columns: readonly Column[] = [
    {
      id: "photos",
      label: "Ảnh",
      render(val) {
        return (
          <img
            className="w-20 h-20 rounded-lg object-cover"
            src={utils.getImageStrapi(val?.[0])}
          />
        );
      },
    },
    { id: "id", label: "Mã yêu cầu" },
    { id: "name", label: "Tên yêu cầu" },
    {
      id: "createdAt",
      label: "Thời gian tạo",
      render: (value: number) => dayjs(value).format(DateFormat.fullDate),
    },
    {
      id: "productType",
      label: "Loại sản phẩm",
      render: (_, record) => record?.data?.productType?.name,
    },
    {
      id: "designType",
      label: "Loại thiết kế",
      render: (_, record) => record?.data?.designType?.name,
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
        <RequestTableAction
          team={team as ITeam}
          refetchTable={refetchRequest}
          data={row}
        />
      ),
    },
  ];

  const { data: team } = useQuery({
    queryFn: teamApi.getMyTeam,
    queryKey: ["getMyTeam"],
  });
  const { control, handleSubmit } = useForm({
    defaultValues: {
      sort: queries.sort,
      search: queries.search,
    },
  });

  const {
    data: dataRequests,
    refetch: refetchRequest,
    isLoading,
  } = useQuery({
    queryFn: () => requestApi.find(queries),
    queryKey: ["requestApi.find", ...Object.values(queries)],
  });

  useEffect(() => loading(isLoading), [isLoading]);

  const addRequestClick = () => {
    if (!team) {
      dialog.confirm({
        content:
          "Bạn không thuộc team nào vui lòng liên hệ với người khác để tham gia team hoặc tạo 1 team mới.",
        okButton: "Tạo team",
      });
    } else {
      setOpenCreateRequest(true);
    }
  };

  const onSearch: SubmitHandler<{ sort?: ESortRequest; search?: string }> = (
    data
  ) => {
    setQueries((s) => ({ ...s, sort: data.sort, search: data.search }));
  };

  return (
    <>
      <CreateRequest
        refetchRequest={refetchRequest}
        open={openCreateRequest}
        handleClose={() => setOpenCreateRequest(false)}
        team={team as ITeam}
      />
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
            value={queries.status}
            onChange={(_, v) => {
              setQueries((s) => ({ ...s, status: v }));
            }}
          >
            {[
              { label: "All", value: "" },
              ...Object.keys(RequestStatus).map((v) => ({
                label: RequestStatus[v as ERequestStatus],
                value: v,
              })),
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
                  count={dataRequests?.meta?.pagination?.total}
                  rowsPerPage={dataRequests?.meta.pagination?.pageSize || 10}
                  page={dataRequests?.meta.pagination.page - 1}
                  onRowsPerPageChange={(e) => {
                    setQueries((s) => ({
                      ...s,
                      pageSize: e.target.value as unknown as number,
                    }));
                  }}
                  onPageChange={(_e, page: number) => {
                    setQueries((s) => ({
                      ...s,
                      page: page + 1,
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
