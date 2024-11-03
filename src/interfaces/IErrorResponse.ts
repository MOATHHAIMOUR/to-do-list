export interface IErrorResponse {
  data: null;
  error: {
    status: 400;
    name: "ApplicationError";
    message: "Email or Username are already taken";
  };
}
