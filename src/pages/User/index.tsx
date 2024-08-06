import ChangePassword from "@/pages/User/ChangePassword";
import Information from "@/pages/User/Information";
import {
  LockOutlined,
  NotificationsNone,
  PersonOutline,
} from "@mui/icons-material";
import {
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { Link, Route, Routes } from "react-router-dom";

export interface IUserProps {}

export default function User(_props: IUserProps) {
  return (
    <div className="container mx-auto mt-20 p-4">
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <List
            component={"nav"}
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Cá nhân
              </ListSubheader>
            }
          >
            <Link to={"/user/information"}>
              <ListItemButton>
                <ListItemIcon>
                  <PersonOutline />
                </ListItemIcon>
                <ListItemText primary="Tài khoản" />
              </ListItemButton>
            </Link>

            <Link to={"/user/notification"}>
              <ListItemButton>
                <ListItemIcon>
                  <NotificationsNone />
                </ListItemIcon>
                <ListItemText primary="Thông báo" />
              </ListItemButton>
            </Link>

            <Link to={"/user/change-password"}>
              <ListItemButton>
                <ListItemIcon>
                  <LockOutlined />
                </ListItemIcon>
                <ListItemText primary="Đăng nhập và bảo mật" />
              </ListItemButton>
            </Link>
          </List>

          <List
            component={"nav"}
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Tổ chức
              </ListSubheader>
            }
          >
            <Link to={"/user/team"}>
              <ListItemButton>
                <ListItemIcon>
                  <PersonOutline />
                </ListItemIcon>
                <ListItemText primary="Đội nhóm" />
              </ListItemButton>
            </Link>
          </List>
        </Grid>
        <Grid item xs={9}>
          <Routes>
            <Route path="/information" element={<Information />} />
            <Route path="/notification" element={<ChangePassword />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/team" element={<Information />} />
          </Routes>
        </Grid>
      </Grid>
    </div>
  );
}
