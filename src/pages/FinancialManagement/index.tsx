import React, { useState } from "react";
import {
  Button,
  Card,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Add, Link } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import transactionApi from "@/api/transaction";
import _ from "lodash";
import CreateTransaction from "@/pages/FinancialManagement/CreateTransaction";
import dayjs from "dayjs";
import utils from "@/utils";

interface Column {
  id: "name" | "code" | "population" | "size" | "density" | any;
  label: string;
  minWidth?: number;
  align?: "right";
  render?: (val: any, row: ITransaction, ind: number) => React.ReactNode;
}

export default function FinancialManagement() {
  const { data: dataRequests, refetch } = useQuery({
    queryFn: () =>
      transactionApi.find({ pagination: { page: 1, pageSize: 10 } }),
    queryKey: ["queryFn"],
  });

  const columns: readonly Column[] = [
    {
      id: "code",
      label: "Mã giao dịch",
    },
    {
      id: "qrCode",
      label: "Link thanh toán",
      render(val) {
        return val ? (
          <IconButton
            onClick={() => {
              window.open(val);
            }}
          >
            <Link />
          </IconButton>
        ) : null;
      },
    },
    {
      id: "amount",
      label: "Số tiền",
      render(val) {
        return utils.formatMoney(val);
      },
    },
    {
      id: "status",
      label: "Trạng thái",
      render(val) {
        return val;
      },
    },
    {
      id: "createdAt",
      label: "Thời gian",
      render(val) {
        return dayjs(val).format("DD/MM/YYYY hh:mm");
      },
    },
  ];

  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {open && (
        <CreateTransaction
          open={open}
          handleClose={() => setOpen(false)}
          refetchTransaction={refetch}
        />
      )}
      <div className="container mx-auto mt-20">
        <div className="flex justify-between items-center">
          <div className="text-3xl">Quản lý tài chính</div>

          <Button
            sx={{ color: "white" }}
            startIcon={<Add />}
            variant="contained"
            color="secondary"
            onClick={() => setOpen(true)}
          >
            Nạp tiền
          </Button>
        </div>

        <Card className="p-4">
          <Select className="w-[150px]" size="small">
            <MenuItem value={""}></MenuItem>
            {/* {sortOptions.map((item, i) => (
              <MenuItem key={i} value={item.value}>
                {item.label}
              </MenuItem>
            ))} */}
          </Select>
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
                    {dataRequests?.data?.map(
                      (row: ITransaction, ind: number) => {
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
                      }
                    )}
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
                    // setParams((s) => ({
                    //   ...s,
                    //   pagination: {
                    //     ...s.pagination,
                    //     pageSize: e.target.value as unknown as number,
                    //   },
                    // }));
                  }}
                  onPageChange={(_e, page: number) => {
                    // setParams((s) => ({
                    //   ...s,
                    //   pagination: { ...s.pagination, page: page },
                    // }));
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
