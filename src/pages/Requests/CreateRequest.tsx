import requestApi from "@/api/request";
import uploadApi from "@/api/upload";
import BaseUpload from "@/components/bases/BaseUpload";
import { toasts } from "@/components/commons/Toast";
import { useConfigStore } from "@/contexts/ConfigProvider";
import {
  Card,
  Modal,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
  Stack,
  Tooltip,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

export interface ICreateRequestProps {
  open?: boolean;
  handleClose?: () => void;
}

interface IFormInput {
  productType?: string;
  designType?: string;
  sampleQuantity: number;
  totalPrice: number;
  note: string;
  photos: Array<IFileData | File>;
}

export default function CreateRequest({
  open = false,
  handleClose,
}: ICreateRequestProps) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<IFormInput>({
    defaultValues: {
      productType: "",
      designType: "",
      sampleQuantity: 1,
      totalPrice: 0,
      note: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: requestApi.create,
    onSuccess() {
      reset();
      toasts.success("Tạo yêu cầu thành công");
      handleClose && handleClose();
    },
  });

  const [productTypes, prices] = useConfigStore((s) => [
    s.listProductType,
    s.listPrice,
  ]);

  const productType = watch("productType");
  const designType = watch("designType");
  const sampleQuantity = watch("sampleQuantity");

  useEffect(() => {
    setValue("designType", undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productType]);

  useEffect(() => {
    if (productType && designType && sampleQuantity) {
      const price = prices.find(
        (p) =>
          p.productType?.id === Number(productType) &&
          p.designType?.id === Number(designType)
      );

      setValue("totalPrice", Number(price?.price) * sampleQuantity || 0);
    } else {
      setValue("totalPrice", 0);
    }
  }, [designType, prices, productType, sampleQuantity, setValue]);

  const designTypes = prices.reduce((d: IDesignType[], e) => {
    if (e.productType.id === Number(productType)) {
      d.push(e.designType);
    }

    return d;
  }, []);

  const onSubmit = async (data: IFormInput) => {
    for (let i = 0; i < data?.photos?.length; i++) {
      const photo = data?.photos[i];
      if (!_.get(photo, "url")) {
        try {
          const file = await uploadApi.uploadFile(photo as File);
          data.photos[i] = file;
        } catch (error) {
          console.log("🚀 ~ onSubmit ~ error:", error);
          return toasts.error("Upload ảnh thất bại, vui lòng thử lại");
        }
      }
    }
    mutate(data);
  };

  return (
    <Modal
      className="flex justify-center items-center"
      open={open}
      onClose={handleClose}
    >
      <Card className="bg-white w-[800px] p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap gap-4">
            {/* First Row */}
            <div className="w-[calc(50%-16px)]">
              <FormControl fullWidth error={!!errors.productType}>
                <label htmlFor="productType">Loại sản phẩm</label>
                <Controller
                  name="productType"
                  control={control}
                  rules={{ required: "Trường này là bắt buộc" }}
                  render={({ field }) => (
                    <Select {...field}>
                      {productTypes.map((p, i) => (
                        <MenuItem key={i} value={String(p.id)}>
                          {p.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.productType && (
                  <FormHelperText>{errors.productType.message}</FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="w-[calc(50%-16px)]">
              <Tooltip
                title={
                  !designTypes.length
                    ? "Không có thiết kế nào trong sản phẩm này"
                    : ""
                }
              >
                <FormControl fullWidth error={!!errors.designType}>
                  <label htmlFor="design-type-label">Loại thiết kế</label>
                  <Controller
                    disabled={!designTypes.length}
                    name="designType"
                    control={control}
                    rules={{ required: "Trường này là bắt buộc" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="design-type-label"
                      >
                        {designTypes?.map((d, i) => (
                          <MenuItem key={i} value={String(d.id)}>
                            {d.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.designType && (
                    <FormHelperText>{errors.designType.message}</FormHelperText>
                  )}
                </FormControl>
              </Tooltip>
            </div>

            {/* Second Row */}
            <div className="w-[calc(50%-16px)]">
              <label htmlFor="sampleQuantity">Số lượng mẫu</label>
              <TextField
                type="number"
                fullWidth
                {...register("sampleQuantity", {
                  required: "Trường này là bắt buộc",
                  validate: (value) =>
                    value >= 1 || "Giá trị phải lớn hơn hoặc bằng 1",
                })}
                error={!!errors.sampleQuantity}
                helperText={errors.sampleQuantity?.message}
              />
            </div>

            <div className="w-[calc(50%-16px)]">
              <label htmlFor="totalPrice">Giá thiết kế</label>
              <TextField
                type="number"
                fullWidth
                {...register("totalPrice", {
                  required: "Trường này là bắt buộc",
                })}
                error={!!errors.totalPrice}
                helperText={errors.totalPrice?.message}
              />
            </div>
          </div>
          <Stack spacing={3}>
            {/* <BaseUpload onChange={}/> */}
            <Controller
              name="photos"
              control={control}
              render={({ field }) => {
                return (
                  <BaseUpload
                    {...field}
                    // onChange={() => {
                    //   console.log(123);
                    // }}
                  />
                );
              }}
            />

            {/* Textarea: Ghi chú */}
            <FormControl error={!!errors.note}>
              <label>Ghí chú</label>
              <Controller
                control={control}
                name="note"
                render={({ field }) => {
                  return (
                    <TextField
                      error={!!errors.note}
                      multiline
                      rows={4}
                      {...field}
                    />
                  );
                }}
              />
              {errors.note && (
                <FormHelperText>{errors.note.message}</FormHelperText>
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
                sx={{ color: "white", background: "" }}
                type="submit"
                variant="contained"
                color="secondary"
              >
                Tạo yêu cầu
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </Modal>
  );
}
