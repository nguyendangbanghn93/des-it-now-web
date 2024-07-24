import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import _ from "lodash";
import utils from "@/utils";
import { useConfigStore } from "@/contexts/ConfigProvider";
import { RequestStatus } from "@/utils/constants";
import RequestTableAction from "@/pages/Requests/RequestTableAction";

interface Column {
  id: "name" | "code" | "population" | "size" | "density" | any;
  label: string;
  minWidth?: number;
  align?: "right";
  render?: (val: any, row: IRequest, ind: number) => React.ReactNode;
}

interface IRequestTable {
  data?: IRequest[];
  pagination?: IPagination;
}

export default function RequestTable({ data = [], pagination }: IRequestTable) {
  console.log("🚀 ~ pagination:", pagination);

  const [listDesignType, listProductType] = useConfigStore((s) => [
    s.listDesignType,
    s.listProductType,
  ]);

  const objDesignType = _.chain(listDesignType).keyBy("id").value();
  const objProductType = _.chain(listProductType).keyBy("id").value();

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
      render: (value: number) => dayjs(value).format("DD/MM/YYYY hh:mm"),
    },
    {
      id: "productType",
      label: "Loại sản phẩm",
      render: (value: number) => objProductType?.[value]?.name || value,
    },
    {
      id: "designType",
      label: "Loại thiết kế",
      render: (value: number) => objDesignType?.[value]?.name || value,
    },
    {
      id: "status",
      label: "Trạng thái",
      render: (value) => _.get(RequestStatus, value, value),
    },
    {
      id: "action",
      label: "Hành động",
      render: (_, row) => <RequestTableAction data={row} />,
    },
  ];

  const handleChangePage = (_: unknown, newPage: number) => {};

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {};

  return (
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
            {data.map((row, ind) => {
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
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={pagination.pageCount}
          rowsPerPage={pagination?.pageSize || 25}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
}
