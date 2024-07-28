import transactionApi from "@/api/transaction";
import { loading } from "@/components/commons/Loading";
import { toasts } from "@/components/commons/Toast";
import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";

import {
  Card,
  Modal,
  Button,
  FormControl,
  FormHelperText,
  TextField,
  Stack,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

export interface ICreateTransactionProps {
  open?: boolean;
  handleClose?: () => void;
  refetchTransaction: () => void;
}

interface ITransactionCreateData {
  amount: number;
}

export default function CreateTransaction({
  refetchTransaction,
  open = false,
  handleClose,
}: ICreateTransactionProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ amount: number }>({
    defaultValues: {
      amount: 0,
    },
  });

  const { mutate, data, isPending } = useMutation({
    mutationFn: transactionApi.create,
    onSuccess() {
      toasts.success("Tạo giao dịch thành công");
      refetchTransaction();
    },
  });

  useEffect(() => {
    loading(isPending);
  }, [isPending]);

  const onSubmit = async (data: ITransactionCreateData) => {
    mutate(data.amount);
  };

  return (
    <Modal
      className="flex justify-center items-center"
      open={open}
      onClose={() => {
        reset();
        handleClose?.();
      }}
    >
      <Card className="bg-white w-[500px] p-8">
        {data?.qrCode ? (
          <>
            <div className="flex justify-center">
              <img className="w-[300px]" src={data?.qrCode} alt="" />
            </div>
            <div className="text-center">
              Vui lòng thanh toán chờ trong giây lát và tải lại trang để cập
              nhật trạng thái thanh toán
            </div>
            <div className="text-right mt-4">
              <Button
                sx={{ color: "white" }}
                variant="contained"
                color="secondary"
                onClick={handleClose}
              >
                Đóng
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <FormControl error={!!errors.amount}>
                <label>Nhập số tiền</label>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field }) => {
                    return (
                      <TextField
                        type="number"
                        error={!!errors.amount}
                        multiline
                        {...field}
                      />
                    );
                  }}
                />
                {errors.amount && (
                  <FormHelperText>{errors.amount.message}</FormHelperText>
                )}
              </FormControl>

              <Stack
                sx={{ display: "flex", justifyContent: "end" }}
                direction="row"
                spacing={2}
              >
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={handleClose}
                >
                  Hủy
                </Button>
                <Button
                  sx={{ color: "white" }}
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  Tạo giao dịch
                </Button>
              </Stack>
            </Stack>
          </form>
        )}
      </Card>
    </Modal>
  );
}
