
import * as yup from "yup"
const validator = {
    email: (value: any) => {
        try {
            yup
                .string()
                .email("Yêu cầu nhập đúng định dạng email")
                .validateSync(value);
        } catch (error: any) {
            return error.message;
        }
    }
}

export default validator