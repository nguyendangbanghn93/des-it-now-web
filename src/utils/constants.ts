export enum ERequestStatus {
  todo = "todo",
  doing = "doing",
  review = "review",
  needEdit = "needEdit",
  done = "done",
}

export enum ETransactionType {
  deposit = "deposit",
  spending = "spending",
}

export enum ETransactionStatus {
  waiting = "waiting",
  paid = "paid",
  cancel = "cancel",
}

export const TransactionType: Record<ETransactionType, string> = {
  [ETransactionType.deposit]: "Nạp tiền",
  [ETransactionType.spending]: "Chi tiêu",
};

export const TransactionStatus: Record<ETransactionStatus, string> = {
  [ETransactionStatus.waiting]: "Chờ thanh toán",
  [ETransactionStatus.paid]: "Đã thanh toán",
  [ETransactionStatus.cancel]: "Đã hủy",
};

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
