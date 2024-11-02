import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { IFormField, LoginFormFields } from "../interfaces/forms";
import ErrorMsg from "../components/ErrorMsg";

const LoginPage = () => {
  const loginFormInputs: IFormField<LoginFormFields>[] = [
    {
      name: "email",
      placeholder: "Enter you email",
      type: "text",
      validation: {
        required: "email is required",
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: "Invalid email format", // Custom error message
        },
      },
    },
    {
      name: "password",
      placeholder: "Enter you password",
      type: "password",
      validation: {
        required: "password is required",
      },
    },
  ];

  /* ────────────── State  ────────────── */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>();

  /* ────────────── Handlers  ────────────── */
  const onSubmit: SubmitHandler<LoginFormFields> = (data) => console.log(data);

  /* ────────────── Render  ────────────── */
  const renderLoginInputs = loginFormInputs.map((input, index) => (
    <div key={index}>
      <Input
        {...register(input.name, {
          required: input.validation?.required,
          pattern: input.validation?.pattern,
        })}
      />
      {errors?.[input.name]?.message && (
        <ErrorMsg msg={errors[input.name]?.message ?? ""} />
      )}
    </div>
  ));

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-8 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {renderLoginInputs}
        <Button fullWidth={true}>Login</Button>
      </form>
    </div>
  );
};

export default LoginPage;