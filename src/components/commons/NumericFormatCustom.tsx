import React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface CustomProps {
  name: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values: any) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator="."
        valueIsNumericString
        suffix=" VND"
        decimalSeparator=","
      />
    );
  }
);

export default NumericFormatCustom;
