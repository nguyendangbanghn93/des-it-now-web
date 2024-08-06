import { Card } from "@mui/material";

export interface INotificationProps {}

export default function Notification(_props: INotificationProps) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-3xl">Thông báo</div>
      </div>

      <Card></Card>
    </div>
  );
}
