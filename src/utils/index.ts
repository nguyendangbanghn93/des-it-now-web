import env from "@/env";
import { QRPay } from "vietnam-qr-pay";
import QRCode from "qrcode";
import dayjs from "dayjs";
import { IMG_DEFAULT } from "@/assets";

const utils = {
  getImageStrapi: (
    image: IFileData,
    {
      size = "medium",
      urlDefault,
    }: {
      size?: "large" | "medium" | "small" | "thumbnail";
      urlDefault?: string;
    } = {}
  ) => {
    const objImg = image?.formats?.[size] || image?.formats?.["small"];
    const url = `${env.VITE_API_URL}${objImg?.url}` || urlDefault;
    return objImg?.url ? url : IMG_DEFAULT;
  },
  formatMoney: (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  },
  async generateBankQRCode({
    bankBin,
    amount,
    purpose,
    bankNumber,
  }: {
    bankNumber: string;
    bankBin: string;
    amount: string;
    purpose: string;
  }) {
    const qrPay = QRPay.initVietQR({
      bankBin: bankBin,
      bankNumber: bankNumber,
      amount: String(amount),
      purpose: purpose,
    });

    const content = qrPay.build();

    return await QRCode.toDataURL(content);
  },
  getDuration(startDate: Date, endDate: Date) {
    try {
      const diffInMilliseconds = dayjs(endDate).diff(startDate);
      const diffDuration = dayjs.duration(diffInMilliseconds);
      const hours = Math.floor(diffDuration.asHours());
      const minutes = diffDuration.minutes();
      const seconds = diffDuration.seconds();

      return `${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.log("🚀 ~ file: index.ts:59 ~ error:", error);
      return "";
    }
  },
};

export default utils;
