export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "TECHNICIAN";
}

export interface IVerifyEmailPayload {
  email: string;
  otp: string;
}

export interface IResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
