import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ErrorMsg from "../components/ErrorMsg";
import { IFormField, RegisterFormFields } from "../interfaces/IForms";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validations";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces/IErrorResponse";

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

  const [isLoading, setIsLoading] = useState(false);

  /* ────────────── Handlers  ────────────── */
  const onSubmit: SubmitHandler<RegisterFormFields> = async (data) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/auth/local/register", {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      if (res.status === 200) {
        toast.success(
          "You will navigate to the login page after 2 seconds to login.",
          {
            position: "bottom-center",
            duration: 1500,
            style: {
              backgroundColor: "black",
              color: "white",
              width: "fit-content",
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(
        errorObj.response?.data?.error?.message ??
          "unknown Error Please Try Again Later! ",
        {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

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
        <Button isLoading={isLoading} type="submit" fullWidth={true}>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
