import React, { useState } from "react";
import {
  Button,
  Card,
  Grid,
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
import { Add, Link, Receipt, Check, AccessTime } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import transactionApi, {
  ESortTransaction,
  IFindTransactionParams,
  sortTransactionOptions,
} from "@/api/transaction";
import _ from "lodash";
import CreateTransaction from "@/pages/FinancialManagement/CreateTransaction";
import dayjs from "dayjs";
import utils from "@/utils";
import {
  ETransactionStatus,
  ETransactionType,
  TransactionStatus,
  TransactionType,
} from "@/utils/constants";
import teamApi from "@/api/team";
import { dialog } from "@/stores/dialogStore";
import QrCode from "@/components/commons/QrCode";
interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right";
  render?: (val: any, row: ITransaction, ind: number) => React.ReactNode;
}

export default function FinancialManagement() {
  const [params, setParams] = useState<IFindTransactionParams>({
    pagination: { page: 1, pageSize: 10 },
    sort: ESortTransaction["createdAt:desc"],
  });

  const { data: dataTransactions, refetch } = useQuery({
    queryFn: () => transactionApi.find(params),
    queryKey: [
      "transactionApi.find",
      Object.values(params.pagination),
      params.sort,
    ],
  });

  const { data: team } = useQuery({
    queryFn: teamApi.getMyTeam,
    queryKey: ["teamApi.getMyTeam"],
  });

  const columns: readonly Column[] = [
    {
      id: "code",
      label: "Mã giao dịch",
    },
    {
      id: "type",
      label: "Loại",
      render(val) {
        return TransactionType[val as ETransactionType] || val;
      },
    },
    {
      id: "qrCode",
      label: "Link thanh toán",
      render(_, record) {
        return record.receiver ? (
          <IconButton
            onClick={() => {
              dialog.info({
                title: "QR Thanh toán",
                content: (
                  <>
                    <QrCode
                      receiver={record.receiver}
                      amount={record.amount}
                      purpose={`DESITNOW${record.id}`}
                    />
                  </>
                ),
              });
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
      render(val, record: ITransaction) {
        const isSpending = record?.type === "spending";
        return (
          <b className={isSpending ? "text-red-500" : "text-green-500"}>
            {isSpending ? "- " : ""}
            {utils.formatMoney(val)}
          </b>
        );
      },
    },
    {
      id: "status",
      label: "Trạng thái",
      render(val) {
        return TransactionStatus[val as ETransactionStatus] || val;
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

      <div className="container mx-auto mt-20 p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center ">
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

        <Grid spacing={2} container>
          {[
            {
              icon: Receipt,
              title: "Tổng tiền đã nạp",
              amount: team?.totalAmountDeposit || 0,
              sub: `Từ ${team?.totalDeposit || 0} invoices`,
            },
            {
              icon: Check,
              title: "Đã chi tiêu",
              amount: team?.totalAmountSpending || 0,
              sub: `Từ ${team?.totalSpending || 0} giao dịch`,
            },
            {
              icon: AccessTime,
              title: "Số dư khả dụng",
              amount: team?.balance || 0,
              sub: "Có thể sử dụng",
            },
          ].map((d, i) => {
            const Icon = d.icon;
            return (
              <Grid key={i} item xs={4}>
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <Card sx={{ borderRadius: "100%", padding: 1 }}>
                      <Icon />
                    </Card>
                    <div>
                      <div className="text-gray-500 text-sm">{d.title}</div>
                      <div className="font-bold">
                        {utils.formatMoney(d.amount || 0)}
                      </div>
                      <div className="text-gray-500 text-sm">{d.sub}</div>
                    </div>
                  </div>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Card className="p-4">
          <Select
            value={params.sort}
            className="w-[150px]"
            size="small"
            onChange={(e) =>
              setParams((s) => ({
                ...s,
                sort: e.target.value as ESortTransaction,
              }))
            }
          >
            {sortTransactionOptions.map((item, i) => (
              <MenuItem key={i} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
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
                    {dataTransactions?.data?.map(
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
              {dataTransactions?.meta.pagination && (
                <TablePagination
                  rowsPerPageOptions={[
                    { label: "10", value: 10 },
                    { label: "20", value: 20 },
                    { label: "25", value: 25 },
                  ]}
                  component="div"
                  count={dataTransactions?.meta.pagination.total}
                  rowsPerPage={
                    dataTransactions?.meta.pagination?.pageSize || 10
                  }
                  page={dataTransactions?.meta.pagination.page - 1}
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
                      pagination: { ...s.pagination, page: page + 1 },
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
