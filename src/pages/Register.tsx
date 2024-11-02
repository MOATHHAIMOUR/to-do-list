import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ErrorMsg from "../components/ErrorMsg";
import { IFormField, RegisterFormFields } from "../interfaces/forms";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validations";

const RegisterPage = () => {
  const registerForm: IFormField<RegisterFormFields>[] = [
    {
      name: "username",
      type: "text",
      placeholder: "Enter username",
    },
    {
      name: "email",
      type: "email",
      placeholder: "Enter email",
      validation: {
        required: "Email is required",
      },
    },
    {
      name: "password",
      type: "password",
      placeholder: "Enter password",
    },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm password",
    },
  ];

  /* ────────────── State  ────────────── */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormFields>({ resolver: yupResolver(registerSchema) });

  /* ────────────── Handlers  ────────────── */
  const onSubmit: SubmitHandler<RegisterFormFields> = (data) =>
    console.log(data);

  /* ────────────── Render  ────────────── */
  const renderRegisterInputs = registerForm.map((input, index) => {
    return (
      <div key={index}>
        <Input {...register(input.name, {})} placeholder={input.placeholder} />
        {errors?.[input.name]?.message && (
          <ErrorMsg msg={errors[input.name]?.message ?? ""} />
        )}
      </div>
    );
  });

  return (
    <div className="max-w-md  mx-auto">
      <h2 className="text-center mb-8 text-3xl font-semibold ">
        Register to get access!
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {renderRegisterInputs}
        <Button type="submit" fullWidth={true}>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
