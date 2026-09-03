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
