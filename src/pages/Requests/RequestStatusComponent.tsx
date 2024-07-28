import { ERequestStatus, RequestStatus } from "@/utils/constants";
import { Chip } from "@mui/material";
import {
  AccessTime,
  CheckCircle,
  List,
  RateReview,
  Reviews,
} from "@mui/icons-material";

const RequestStatusComponent = {
  [ERequestStatus.todo]: (
    <Chip
      className="cursor-pointer"
      size="small"
      sx={{
        border: "none",
        background: "rgb(255, 252, 55)",
        color: "",
        width: 130,
      }}
      label={
        <div className="flex gap-2 items-center cursor-pointer">
          <List color="inherit" fontSize={"small"} />
          {RequestStatus[ERequestStatus.todo]}
        </div>
      }
      variant="outlined"
    />
  ),
  [ERequestStatus.doing]: (
    <Chip
      className="cursor-pointer"
      size="small"
      sx={{
        border: "none",
        background: "rgb(70, 28, 237)",
        color: "#fff",
        width: 130,
      }}
      label={
        <div className="flex gap-2 items-center cursor-pointer">
          <AccessTime color="inherit" fontSize={"small"} />
          {RequestStatus[ERequestStatus.doing]}
        </div>
      }
      variant="outlined"
    />
  ),
  [ERequestStatus.review]: (
    <Chip
      className="cursor-pointer"
      size="small"
      sx={{
        border: "none",
        background: "rgb(255, 141, 47)",
        color: "#fff",
        width: 130,
      }}
      label={
        <div className="flex gap-2 items-center cursor-pointer">
          <Reviews color="inherit" fontSize={"small"} />
          {RequestStatus[ERequestStatus.review]}
        </div>
      }
      variant="outlined"
    />
  ),
  [ERequestStatus.needEdit]: (
    <Chip
      className="cursor-pointer"
      size="small"
      sx={{
        border: "none",
        background: "rgb(222, 0, 0)",
        color: "#fff",
        width: 130,
      }}
      label={
        <div className="flex gap-2 items-center cursor-pointer">
          <RateReview color="inherit" fontSize={"small"} />
          {RequestStatus[ERequestStatus.needEdit]}
        </div>
      }
      variant="outlined"
    />
  ),
  [ERequestStatus.done]: (
    <Chip
      className="cursor-pointer"
      size="small"
      sx={{
        border: "none",
        background: "rgb(5, 226, 27)",
        color: "#fff",
        width: 130,
      }}
      label={
        <div className="flex gap-2 items-center cursor-pointer">
          <CheckCircle color="inherit" fontSize={"small"} />
          {RequestStatus[ERequestStatus.done]}
        </div>
      }
      variant="outlined"
    />
  ),
};

export default RequestStatusComponent;
