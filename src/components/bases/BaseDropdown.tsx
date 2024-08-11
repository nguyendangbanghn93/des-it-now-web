import * as React from "react";

import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

interface IItem {
  icon?: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
    muiName: string;
  };
  title: React.ReactNode;
  onClick?: () => void;
}

interface IBaseDropdown {
  children: React.ReactElement;
  items: IItem[];
}

export default function BaseDropdown({ children, items }: IBaseDropdown) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <span onClick={handleClick}>{children}</span>
      {items?.length ? (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          // PaperProps={{
          //   elevation: 0,
          //   sx: {
          //     overflow: "visible",
          //     filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          //     mt: 1.5,
          //     "& .MuiAvatar-root": {
          //       width: 32,
          //       height: 32,
          //       ml: -0.5,
          //       mr: 1,
          //     },
          //     "&::before": {
          //       content: '""',
          //       display: "block",
          //       position: "absolute",
          //       top: 0,
          //       right: 14,
          //       width: 10,
          //       height: 10,
          //       bgcolor: "background.paper",
          //       transform: "translateY(-50%) rotate(45deg)",
          //       zIndex: 0,
          //     },
          //   },
          // }}
        >
          {items.map((item, ind) => {
            const Icon = item.icon;

            return (
              <MenuItem
                key={ind}
                onClick={() => {
                  item?.onClick?.();
                  handleClose();
                }}
              >
                {Icon && (
                  <ListItemIcon>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                )}
                {item.title}
              </MenuItem>
            );
          })}
        </Menu>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}
