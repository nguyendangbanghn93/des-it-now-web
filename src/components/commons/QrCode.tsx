import utils from "@/utils";
import _ from "lodash";
import { useEffect, useState } from "react";

export interface IQrCodeProps {
  amount: number;
  purpose: string;
  receiver: {
    bankBin: string;
    bankNumber: string;
    bankName: string;
    bankUsername: string;
  };
}

export default function QrCode({ amount, purpose, receiver }: IQrCodeProps) {
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    if (amount && !_.isEmpty(receiver)) {
      utils
        .generateBankQRCode({
          bankNumber: receiver.bankNumber,
          bankBin: receiver.bankBin,
          amount: amount as unknown as string,
          purpose: purpose,
        })
        .then((res) => setQrCode(res as string));
    }
  }, [amount, purpose, receiver]);

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
          {receiver ? (
            <>
              <div>Tên chủ TK: {receiver.bankUsername}</div>
              <b className="">Số TK: {receiver.bankNumber}</b>
              <div> {receiver.bankName}</div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
