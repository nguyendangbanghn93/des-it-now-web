import env from "@/env";
import { QRPay, BanksObject } from "vietnam-qr-pay";
import QRCode from "qrcode";
console.log(BanksObject.mbbank.bin);

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
    return url;
  },
  formatMoney: (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  },
  async generateBankQRCode({
    amount,
    purpose,
  }: {
    amount: string;
    purpose: string;
  }) {
    const qrPay = QRPay.initVietQR({
      bankBin: BanksObject.mbbank.bin,
      bankNumber: env.VITE_BANK_NUMBER,
      amount: String(amount),
      purpose: purpose,
    });

    const content = qrPay.build();

    return await QRCode.toDataURL(content);
  },
};

export default utils;
