import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export interface IRequestsProps {}

export default function Requests(_props: IRequestsProps) {
  return (
    <div className="container mx-auto mt-20">
      <div className="flex justify-between items-center">
        <div className="text-3xl">Danh sách yêu cầu</div>
        <Button startIcon={<AddIcon />} variant="contained" color="error">
          Thêm
        </Button>
      </div>
    </div>
  );
}
