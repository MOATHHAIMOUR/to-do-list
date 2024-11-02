import * as yup from "yup";

export const registerSchema = yup
  .object({
    username: yup
      .string()
      .required("Username is required!")
      .min(5, "Username should at least be 5 character"),
    email: yup
      .string()
      .required("email is required")
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password: yup.string().required("password is required"),
    confirmPassword: yup
      .string()
      .required("confirmPassword is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();
