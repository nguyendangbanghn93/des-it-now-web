import { Avatar, Button } from "@mui/material";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BaseDropdown from "@/components/bases/BaseDropdown";
import CreateIcon from "@mui/icons-material/Create";
import HomeIcon from "@mui/icons-material/Home";
import { LOGO_WHITE } from "@/assets";
import { Link } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import TopicIcon from "@mui/icons-material/Topic";
import useAuthStore from "@/stores/authStore";

export interface ITopBarProps {}

export default function TopBar(_props: ITopBarProps) {
  const logout = useAuthStore((s) => s.logout);
  return (
    <div className="w-full sticky top-0 left-0 bg-[#121620] flex p-4 items-center justify-between">
      <div className="flex items-center">
        <Link to={"/"}>
          <img src={LOGO_WHITE} />
        </Link>
        <div className="flex ml-8">
          {[
            { icon: HomeIcon, title: "Tổng quan", to: "/" },
            { icon: CreateIcon, title: "Quản lý yêu cầu", to: "/requests" },
            {
              icon: AccountBalanceWalletIcon,
              title: "Quản lý tài chính",
              to: "/",
            },
            { icon: TopicIcon, title: "Hướng dẫn", to: "/" },
          ].map((item, ind) => {
            const Icon = item.icon;
            return (
              <Link key={ind} className="" to={item.to}>
                <Button color="inherit" className="!p-0">
                  <div
                    color="secondary"
                    className={`rounded-lg flex gap-2 items-center text-white font-bold py-2 px-5 ${
                      ind === 0 ? "bg-orange-600" : ""
                    }`}
                  >
                    <Icon /> {item.title}
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex">
        <Button>
          <SearchIcon className="text-white" />
        </Button>
        <Button>
          <NotificationsNoneIcon className="text-white" />
        </Button>
        <BaseDropdown
          items={[
            {
              icon: Logout,
              title: "Đăng xuất",
              onClick: function (): void {
                logout();
              },
            },
          ]}
        >
          <Button>
            <div className="flex text-white items-center gap-4">
              Nguyễn Đăng Bằng
              <Avatar>N</Avatar>
            </div>
          </Button>
        </BaseDropdown>
      </div>
    </div>
  );
}
