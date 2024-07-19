import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export interface IDashboardProps {}

export default function Dashboard(_props: IDashboardProps) {
  return (
    <div className="container mx-auto mt-20">
      <div className="flex justify-between items-center">
        <div className="text-3xl">Trang tổng quan</div>
        <Button startIcon={<AddIcon />} variant="contained" color="error">
          Tạo yêu cầu
        </Button>
      </div>
    </div>
  );
}
