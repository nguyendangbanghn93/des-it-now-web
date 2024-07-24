import { Button, Card, MenuItem, Select, Tab, Tabs } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import BaseTextField from "@/components/bases/BaseTextField";
import { FilterList } from "@mui/icons-material";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import teamApi from "@/api/team";
import useDiaLog from "@/hooks/useDialog";
import CreateRequest from "@/pages/Requests/CreateRequest";
import requestApi from "@/api/request";
import RequestTable from "@/pages/Requests/RequestTable";

export interface IRequestsProps {}

export default function Requests(_props: IRequestsProps) {
  const [tab, setTab] = useState("all");
  const [sort, setShort] = useState("new");
  const [keyword, setKeyword] = useState<string>();
  const { dialog, context } = useDiaLog();
  const [openCreateRequest, setOpenCreateRequest] = useState(false);

  const { data: team } = useQuery({
    queryFn: teamApi.getMyTeam,
    queryKey: ["getMyTeam"],
  });

  const { data: dataRequests, refetch: refetchRequest } = useQuery({
    queryFn: requestApi.find,
    queryKey: ["requestApi.find"],
  });

  console.log("🚀 ~ Requests ~ dataRequests:", dataRequests);

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

  return (
    <>
      <CreateRequest
        refetchRequest={refetchRequest}
        open={openCreateRequest}
        handleClose={() => setOpenCreateRequest(false)}
      />
      {context}
      <div className="container mx-auto mt-20">
        <div className="flex justify-between items-center mb-4">
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
            value={tab}
            onChange={(_, v) => {
              setTab(v);
            }}
          >
            {[
              { label: "All", value: "all" },
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

          <div className="flex gap-4 mt-4">
            <Select
              className="w-[150px]"
              size="small"
              value={sort}
              onChange={(a) => setShort(a.target.value)}
            >
              {[
                { label: "Mới nhất", value: "new" },
                { label: "Cũ nhất", value: "old" },
              ].map((item, i) => (
                <MenuItem key={i} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>

            <BaseTextField
              placeholder="Tìm id hoặc tên yêu cầu"
              wrapClass="w-[300px]"
              value={keyword}
              onChange={(value) => setKeyword(value.target.value)}
            />

            <Button
              startIcon={<FilterList />}
              variant="contained"
              color="secondary"
              sx={{ color: "white" }}
            >
              Lọc
            </Button>
          </div>
          <div className="mt-4">
            <RequestTable
              data={dataRequests?.data || []}
              pagination={dataRequests?.meta?.pagination}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
