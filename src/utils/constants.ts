export enum ERequestStatus {
  todo = "todo",
  doing = "doing",
  review = "review",
  needEdit = "needEdit",
  done = "done",
}

export const RequestStatus: Record<ERequestStatus, string> = {
  [ERequestStatus.todo]: "Cần làm",
  [ERequestStatus.doing]: "Đang làm",
  [ERequestStatus.review]: "Cần review",
  [ERequestStatus.needEdit]: "Cần sửa",
  [ERequestStatus.done]: "Hoàn thành",
};

export const DateFormat = {
  fullDate: "DD/MM/YYYY hh:mm:ss",
  fullTime: "hh:mm:ss",
};
