import { NotificationsNone } from "@mui/icons-material";
import { Card } from "@mui/material";
import _ from "lodash";

export interface INotificationProps {}

export default function Notification(_props: INotificationProps) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-3xl">Thông báo</div>
      </div>

      <Card className="mt-4 p-4">
        <div className="flex gap-4 items-center text-xl">
          <div className="bg-white w-10 h-10 rounded-full shadow flex justify-center items-center">
            <NotificationsNone />
          </div>
          Danh sách thông báo
        </div>

        {/* <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Controller
              name="currentPassword"
              control={control}
              rules={{ required: "Yêu cầu bắt buộc có giá trị" }}
              render={({ field }) => (
                <div>
                  <label htmlFor="">Mật khẩu cũ*</label>
                  <TextField
                    error={!!errors.currentPassword}
                    // helperText={
                    //   errors.currentPassword
                    //     ? errors.currentPassword.message
                    //     : ""
                    // }
                    {...field}
                    variant="outlined"
                    fullWidth
                    type="password"
                  />
                </div>
              )}
            />

            <Controller
              rules={{ required: "Yêu cầu bắt buộc có giá trị" }}
              name="password"
              control={control}
              render={({ field }) => (
                <div>
                  <label htmlFor="">Mật khẩu mới*</label>
                  <TextField
                    {...field}
                    error={!!errors.password}
                    // helperText={errors.password ? errors.password.message : ""}
                    type="password"
                    variant="outlined"
                    fullWidth
                  />
                </div>
              )}
            />

            <Controller
              rules={{ required: "Yêu cầu bắt buộc có giá trị" }}
              name="passwordConfirmation"
              control={control}
              render={({ field }) => (
                <div>
                  <label htmlFor="">Nhập lại mật khẩu*</label>
                  <TextField
                    {...field}
                    error={!!errors.passwordConfirmation}
                    // helperText={
                    //   errors.passwordConfirmation
                    //     ? errors.passwordConfirmation.message
                    //     : ""
                    // }
                    type="password"
                    variant="outlined"
                    fullWidth
                  />
                </div>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                variant="contained"
                color="inherit"
                onClick={() => reset()}
              >
                Hủy
              </Button>
              <Button
                disabled={!isChange}
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ color: "white" }}
              >
                Lưu
              </Button>
            </div>
          </Box>
        </form> */}
      </Card>
    </div>
  );
}
