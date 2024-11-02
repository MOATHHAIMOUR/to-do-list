import { Validate, ValidationRule } from "react-hook-form";

export interface IFormField<T> {
  name: keyof T;
  type: string;
  placeholder: string;
  validation?: {
    pattern?: ValidationRule<RegExp>;
    required?: string;
    validate?: Validate<string, T>;
    minLength?: number;
  };
}

export interface RegisterFormFields {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormFields {
  email: string;
  password: string;
}
