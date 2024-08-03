import { Button, Card } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import {
  Checklist,
  FormatListBulleted,
  FormatListNumbered,
  PieChartOutline,
  PlaylistPlay,
  PlaylistRemove,
} from "@mui/icons-material";

export interface IDashboardProps {}

export default function Dashboard(_props: IDashboardProps) {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto mt-20">
      <div className="flex justify-between items-center">
        <div className="text-3xl">Trang tổng quan</div>
        <Button
          onClick={() => navigate("/requests", { state: { create: true } })}
          sx={{ color: "white" }}
          startIcon={<AddIcon />}
          variant="contained"
          color="secondary"
        >
          Tạo yêu cầu
        </Button>
      </div>

      <div className="grid grid-cols-12 w-full gap-4 mt-4">
        <Card className="flex p-4 col-span-12">
          {[
            {
              title: "Tổng số yêu cầu",
              count: 100,
              to: "",
              color: "#E48E3E",
              icon: FormatListBulleted,
            },
            {
              title: "Yêu cầu đang làm",
              count: 10,
              to: "",
              color: "#009721",
              icon: PlaylistPlay,
            },
            {
              title: "Yêu cầu đã xong",
              count: 80,
              to: "",
              color: "#4865FF",
              icon: Checklist,
            },
            {
              title: "Yêu cầu đã hủy",
              count: 10,
              to: "",
              color: "",
              icon: PlaylistRemove,
            },
          ].map((d, i) => {
            const Icon = d.icon;
            return (
              <div
                className="flex-1 flex justify-around first:border-l-0 border-l p-4"
                key={i}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    !d.color ? "shadow" : ""
                  }`}
                  style={{ background: d.color, color: d.color ? "#fff" : "" }}
                >
                  <Icon />
                </div>
                <div>
                  <div className="font-light">{d.title}</div>
                  <b style={{ color: d.color }}>{d.count}</b>
                  <div className="text-right">
                    <Link
                      className="font-bold"
                      to={d.to}
                      style={{ color: d.color }}
                    >
                      Xem thêm
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
        <Card className="p-4 col-span-8">
          <div className="flex items-center gap-2">
            <PieChartOutline />
            Danh sách sản phẩm
          </div>
        </Card>
        <Card className="p-4 col-span-4">
          {" "}
          <div className="flex items-center gap-2">
            <FormatListNumbered />
            Các yêu cầu mới nhất
          </div>
        </Card>
      </div>
    </div>
  );
}
