import env from "@/env";
import utils from "@/utils";
import { useEffect, useState } from "react";

export interface IQrCodeProps {
  amount: number;
  purpose: string;
}

export default function QrCode({ amount, purpose }: IQrCodeProps) {
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    if (amount) {
      utils
        .generateBankQRCode({
          amount: amount as unknown as string,
          purpose: purpose,
        })
        .then((res) => setQrCode(res as string));
    }
  }, [amount, purpose]);

  return (
    <>
      <div className="">
        <div className="flex justify-center mb-4">
          <div className="border-2 border-blue-700 rounded-sm">
            <img className="w-[300px]" src={qrCode} alt="" />
          </div>
        </div>

        <div className="text-center text-blue-700">
          <div>Số tiền: {utils.formatMoney(amount)}</div>
          <div>Nội dung CK: {purpose}</div>
          <div>Tên chủ TK: {env.VITE_BANK_USER_NAME}</div>
          <b className="">Số TK: {env.VITE_BANK_NUMBER}</b>
          <div> {env.VITE_BANK_NAME}</div>
        </div>
      </div>
    </>
  );
}
