import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bak_url: process.env.APP_URL,
  frontend_url: process.env.FRONTEND_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN as string,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
  redis_user: process.env.REDIS_USER as string,
  redis_password: process.env.REDIS_PASSWORD as string,
  redis_host: process.env.REDIS_HOST as string,
  redis_port: process.env.REDIS_PORT as string,
  smtp_host: process.env.SMTP_HOST as string,
  smtp_port: process.env.SMTP_PORT as string,
  smtp_user: process.env.SMTP_USER as string,
  smtp_password: process.env.SMTP_PASSWORD as string,
  email_sender: process.env.EMAIL_SENDER as string,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
  google_callback_url: process.env.GOOGLE_CALLBACK_URL as string,
  google_client_id: process.env.GOOGLE_CLIENT_ID as string,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY as string,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET as string,

  tester_customer_name: process.env.TESTER_CUSTOMER_NAME as string,
  tester_customer_email: process.env.TESTER_CUSTOMER_EMAIL as string,
  tester_customer_password: process.env.TESTER_CUSTOMER_PASSWORD as string,

  tester_admin_name: process.env.TESTER_ADMIN_NAME as string,
  tester_admin_email: process.env.TESTER_ADMIN_EMAIL as string,
  tester_admin_password: process.env.TESTER_ADMIN_PASSWORD as string,

  tester_technician_name: process.env.TESTER_TECHNICIAN_NAME as string,
  tester_technician_email: process.env.TESTER_TECHNICIAN_EMAIL as string,
  tester_technician_password: process.env.TESTER_TECHNICIAN_PASSWORD as string,

  stripe_secret_key: process.env.STRIPE_SECRET_KEY as string,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET as string,
};
