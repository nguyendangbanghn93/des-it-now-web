import { Box, InputLabel, TextField, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";

type IBaseTextFieldProps = TextFieldProps & {
  wrapClass?: string;
  labelClass?: string;
};

const BaseTextField = forwardRef<HTMLInputElement, IBaseTextFieldProps>(
  (
    {
      id,
      label,
      wrapClass = "",
      labelClass = "",
      fullWidth = true,
      required,
      ...props
    },
    ref
  ) => {
    return (
      <Box className={wrapClass}>
        <InputLabel required={required} className={labelClass} htmlFor={id}>
          {label}
        </InputLabel>
        <TextField
          fullWidth={fullWidth}
          id={id}
          name={id}
          inputRef={ref}
          autoFocus
          {...props}
        />
      </Box>
    );
  }
);

export default BaseTextField;
