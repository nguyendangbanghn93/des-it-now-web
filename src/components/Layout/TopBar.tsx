import { Avatar, Button } from "@mui/material";

import { LOGO_WHITE } from "@/assets";
import BaseDropdown from "@/components/bases/BaseDropdown";
import useAuthStore from "@/stores/authStore";
import { Logout } from "@mui/icons-material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CreateIcon from "@mui/icons-material/Create";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import TopicIcon from "@mui/icons-material/Topic";
import { Link, useMatch } from "react-router-dom";

export interface ITopBarProps {}

export default function TopBar(_props: ITopBarProps) {
  const logout = useAuthStore((s) => s.logout);
  const match = useMatch("/:page");

  return (
    <div className="w-full sticky top-0 left-0 bg-[#121620] flex p-4 items-center justify-between">
      <div className="flex items-center">
        <Link to={"/"}>
          <img src={LOGO_WHITE} />
        </Link>
        <div className="flex ml-8 gap-2">
          {[
            { icon: HomeIcon, title: "Tổng quan", to: "/" },
            {
              icon: CreateIcon,
              title: "Quản lý yêu cầu",
              to: "/requests",
              page: "requests",
            },
            {
              icon: AccountBalanceWalletIcon,
              title: "Quản lý tài chính",
              to: "/financial",
              page: "financial",
            },
            {
              icon: TopicIcon,
              title: "Hướng dẫn",
              to: "/guide",
              page: "guide",
            },
          ].map((item, ind) => {
            const Icon = item.icon;
            return (
              <Link key={ind} className="" to={item.to}>
                <Button
                  color={
                    match?.params.page === item.page ? "secondary" : "inherit"
                  }
                  variant={
                    match?.params.page === item.page ? "contained" : "text"
                  }
                  sx={{ color: "white" }}
                >
                  <Icon /> {item.title}
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
