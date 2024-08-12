import { Select, SelectProps } from "@mui/material";
import { forwardRef } from "react";

const BaseSelect = forwardRef(({ children, ...rest }: SelectProps, ref) => {
  return (
    <Select {...rest} ref={ref}>
      {children}
    </Select>
  );
});

export default BaseSelect;
