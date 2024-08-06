import { Card } from "@mui/material";

export interface ITeamProps {}

export default function Team(_props: ITeamProps) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-3xl">Đội nhóm</div>
      </div>

      <Card></Card>
    </div>
  );
}
