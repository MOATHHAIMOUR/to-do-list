export interface IFormField<T> {
  name: keyof T;
  type: string;
  placeholder: string;
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
