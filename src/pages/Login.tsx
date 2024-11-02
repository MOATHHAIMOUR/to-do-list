import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { IFormField, LoginFormFields } from "../interfaces/IForms";
import ErrorMsg from "../components/ErrorMsg";
import { loginSchema } from "../validations";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useState } from "react";
import axiosInstance from "../config/axios.config";

const LoginPage = () => {
  const loginFormInputs: IFormField<LoginFormFields>[] = [
    {
      name: "email",
      placeholder: "Enter you email",
      type: "text",
    },
    {
      name: "password",
      placeholder: "Enter you password",
      type: "password",
    },
  ];

  /* ────────────── State  ────────────── */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({ resolver: yupResolver(loginSchema) });

  const [isLoading, setIsLoading] = useState(false);

  //const navigate = useNavigate();
  /* ────────────── Handlers  ────────────── */
  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    try {
      setIsLoading(true);
      console.log(data);
      const res = await axiosInstance.post("/auth/local", {
        identifier: data.email,
        password: data.password,
      });
      if (res.status === 200) {
        toast.success("You will navigate to the home page after 2 seconds.", {
          position: "bottom-center",
          duration: 1800,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        setTimeout(() => {
          localStorage.setItem("loggedInUser", JSON.stringify(res.data));
          location.replace("/");
        }, 2000);
      }
    } catch {
      //const errorObj = error as AxiosError<IErrorResponse>;
      toast.error("email or password is incorrect", {
        position: "bottom-center",
        duration: 1800,
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ────────────── Render  ────────────── */
  const renderLoginInputs = loginFormInputs.map((input, index) => (
    <div key={index}>
      <Input
        {...register(input.name)}
        placeholder={input.placeholder}
        type={input.type}
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
        <Button isLoading={isLoading} fullWidth={true}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
