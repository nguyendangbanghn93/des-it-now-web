import {
  Button,
  Chip,
  Drawer,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  CloseOutlined,
  AccessTime,
  CheckCircle,
  EditOutlined,
} from "@mui/icons-material";
import dayjs from "dayjs";

export interface IRequestTableActionProps {
  data: IRequest;
}

export default function RequestTableAction({ data }: IRequestTableActionProps) {
  console.log("🚀 ~ RequestTableAction ~ data:", data)
  const [open, setOpen] = useState<boolean>(false);
  const [time, setTime] = useState(data.createdAt);
  return (
    <div>
      <IconButton onClick={() => setOpen(true)}>
        <VisibilityIcon />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className="w-[500px] p-4">
          <div className="flex items-center justify-between">
            <div className="font-bold">Yêu cầu: #${data.id}</div>
            <IconButton onClick={() => setOpen(true)}>
              <CloseOutlined />
            </IconButton>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="font-bold">Mô tả yêu cầu</div>
            <div className="flex gap-4">
              <Chip
                size="small"
                label={
                  <div className="flex gap-2 items-center">
                    <AccessTime fontSize={"small"} />
                    {dayjs(time).format("hh:mm:ss")}
                  </div>
                }
                variant="filled"
                color="secondary"
              />
              <Chip
                size="small"
                label={
                  <div className="flex gap-2 items-center">
                    <CheckCircle color="success" fontSize={"small"} />
                    Đang làm
                  </div>
                }
                variant="outlined"
              />
              <Button
                sx={{ borderRadius: 8 }}
                size="small"
                className="flex gap-2"
                color="inherit"
              >
                <div className="text-sm text-gray-500">
                  <EditOutlined fontSize="small" />
                  Sửa
                </div>
              </Button>
            </div>
          </div>

          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 350 }} size="small">
                <TableBody>
                  {/* [{key:"creator",label:"Người tạo"}] */}
                  {/* {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.calories}</TableCell>
                      <TableCell align="right">{row.fat}</TableCell>
                      <TableCell align="right">{row.carbs}</TableCell>
                      <TableCell align="right">{row.protein}</TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
