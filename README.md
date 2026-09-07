# FixFlow - Field Service Management System

FixFlow is a backend-focused Field Service Management System designed to connect customers with professional technicians for different types of home and field services.

The system provides secure authentication, role-based authorization, technician management, service request management, Stripe payment integration, reviews and ratings, audit logging, API documentation, and administrative controls.

---
# 📚 API Documentation

### Swagger UI — Local

```text
http://localhost:5000/api-docs
```

### Swagger UI — Production

```text
https://fixflow-server.vercel.app/api-docs
```

---

# ✨ Features

## 🔐 Authentication

- Email and password registration
- Email/password login
- Google OAuth login
- Password hashing
- Email verification
- Role-based authentication & authorization
- JWT Bearer authentication

## 👤 User Management

- Get authenticated user profile
- Update profile information
- Upload profile image
- Delete profile image
- Soft delete support

## 🧑‍🔧 Technician Management

- Technician registration
- Technician profile management
- Skills and experience management
- Hourly rate management
- Technician availability status
- Admin technician approval
- Automatic technician rating calculation

## 🛠️ Service Requests

### Customers can:

- Create service requests
- View their service requests
- Search service requests
- Filter by status
- Pagination
- Sort service requests
- Update pending requests
- Cancel pending requests
- View service request details

### Technicians can:

- Accept assigned requests
- Start service
- Complete service
- Submit final service price

### Admins can:

- View all service requests
- Assign technicians
- Manage service workflow

## 💳 Payment

FixFlow uses **Stripe** for online payments.

Features:

- Stripe Checkout Session
- Payment creation
- Payment status tracking
- Stripe webhook integration
- Successful payment handling
- Transaction ID storage
- Customer payment history
- Admin payment history
- Payment status filtering

## ⭐ Reviews & Ratings

Customers can:

- Review completed services
- Give 1–5 star ratings
- Add comments

The technician's average rating is automatically recalculated after a review.

## 🔐 Audit Logging

FixFlow maintains audit logs for important system actions.

Examples:

```text
TECHNICIAN_APPROVED
TECHNICIAN_ASSIGNED
SERVICE_REQUEST_ACCEPTED
SERVICE_REQUEST_STARTED
SERVICE_REQUEST_COMPLETED
PAYMENT_COMPLETED
```

Audit logs contain:

- User
- Action
- Entity
- Entity ID
- Previous data
- New data
- IP address
- User agent
- Timestamp

Only **Admin** users can view audit logs.

---

# 👥 User Roles

FixFlow has three roles:

| Role | Description |
|------|-------------|
| CUSTOMER | Requests services and makes payments |
| TECHNICIAN | Handles assigned service requests |
| ADMIN | Manages technicians, services, payments and system activities |

### 👤 Customer

```text
Register
Login
Create Service Request
View Service Requests
Cancel Service Request
Make Payment
View Payments
Create Review
```

### 🧑‍🔧 Technician

```text
Register
Login
Update Technician Profile
View Assigned Services
Accept Service
Start Service
Complete Service
```

### 👑 Admin

```text
Login
Approve Technician
Assign Technician
View All Service Requests
View All Payments
View Audit Logs
Manage Service Categories
```

---

# 🛠️ Tech Stack

## Backend

- Node.js
- TypeScript
- Express.js

## Database

- PostgreSQL
- Prisma ORM

## Validation

- Zod

## Authentication

- JWT
- Google OAuth

## Payment

- Stripe

## Email

- Nodemailer / SMTP

## API Documentation

- OpenAPI
- Swagger UI
- Redocly

## Development Tools

- Biome
- TypeScript checks
- Postman
- Git
- GitHub

## Deployment

- Vercel / Render
- PostgreSQL hosting

---

# 📁 Project Structure

```text
fixflow-server/
│
├── prisma/
│   └── schema/
│
├── openapi/
│   ├── index.yml
│
├── src/
│   │
│   ├── app/
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── notFound.ts
│   │   │   └── validateRequest.ts
│   │   │
│   │   ├── module/
│   │   │   │
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── technician/
│   │   │   ├── category/
│   │   │   ├── service-request/
│   │   │   ├── payment/
│   │   │   ├── review/
│   │   │   └── audit-log/
│   │   │
│   │   └── utils/
│   │
│   ├── config/
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .gitignore
├── biome.json
├── package.json
├── prisma.config.ts
├── swagger.yml
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

---

# 🗄️ Database Models

FixFlow currently uses the following main models:

```text
User
TechnicianProfile
ServiceCategory
ServiceRequest
Payment
Review
AuditLog
```

### Relationship Overview

```text
User
 │
 ├── TechnicianProfile
 │
 ├── ServiceRequest
 │      │
 │      ├── ServiceCategory
 │      ├── Payment
 │      └── Review
 │
 ├── Payment
 │
 ├── Review
 │
 └── AuditLog
```

---

# 🔑 Environment Variables

Create a `.env` file:

```env
NODE_ENV=development

PORT=5000

DATABASE_URL="your_postgresql_database_url"

JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="7d"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/v1/auth/google/callback"

# Email
SMTP_HOST="your_smtp_host"
SMTP_PORT=587
SMTP_USER="your_smtp_user"
SMTP_PASS="your_smtp_password"

# Stripe
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Tester Accounts
TESTER_CUSTOMER_NAME="Test Customer"
TESTER_CUSTOMER_EMAIL="customer@fixflow.com"
TESTER_CUSTOMER_PASSWORD="Password123!"

TESTER_ADMIN_NAME="Test Admin"
TESTER_ADMIN_EMAIL="admin@fixflow.com"
TESTER_ADMIN_PASSWORD="Password123!"

TESTER_TECHNICIAN_NAME="Test Technician"
TESTER_TECHNICIAN_EMAIL="technician@fixflow.com"
TESTER_TECHNICIAN_PASSWORD="Password123!"
```

> Never commit `.env` or real credentials to GitHub.

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/omarfarukGit/fixflow-server.git
```

## 2. Enter the project

```bash
cd fixflow-server
```

## 3. Install dependencies

```bash
npm install
```

## 4. Configure environment variables

Create:

```text
.env
```

and add the required environment variables.

## 5. Generate Prisma Client

```bash
npx prisma generate
```

## 6. Run database migration

```bash
npx prisma migrate dev
```

## 7. Start development server

```bash
npm run dev
```

Server:

```text
http://localhost:5000
```

---

# 📜 Available Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm run start

# Type checking
npm run type-check

# Run tests
npm run test

# Biome format
npm run format

# Biome format check
npm run format:check

# Biome lint
npm run lint:check

# Swagger documentation build
npm run swagger:docs

# Prisma generate
npx prisma generate

# Prisma migration
npx prisma migrate dev
```

---

# 🔐 Authentication

FixFlow uses **JWT Bearer authentication**.

After successful login:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "your_access_token"
  }
}
```

Send the token in protected APIs:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

# 🌐 API Versioning

All APIs use versioning:

```text
/api/v1
```

Example:

```http
GET /api/v1/users/me
```

---

# 📡 API Endpoints

## Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/google
GET  /api/v1/auth/google/callback
```

---

## User

```http
GET    /api/v1/users/me
PATCH  /api/v1/users/me
PATCH  /api/v1/users/me/image
DELETE /api/v1/users/me/image
```

---

## Technician

```http
PATCH /api/v1/technicians/me/profile
PATCH /api/v1/technicians/:technicianId/approve
```

---

## Service Categories

```http
POST   /api/v1/categories
GET    /api/v1/categories
GET    /api/v1/categories/:id
PATCH  /api/v1/categories/:id
DELETE /api/v1/categories/:id
```

---

## Service Requests

```http
POST   /api/v1/service-requests

GET    /api/v1/service-requests

GET    /api/v1/service-requests/admin

GET    /api/v1/service-requests/:id

PATCH  /api/v1/service-requests/:id

PATCH  /api/v1/service-requests/:id/cancel

PATCH  /api/v1/service-requests/:id/assign

PATCH  /api/v1/service-requests/:id/accept

PATCH  /api/v1/service-requests/:id/start

PATCH  /api/v1/service-requests/:id/complete
```

---

# 💳 Payments

```http
POST /api/v1/payments/create-checkout-session

GET  /api/v1/payments/my-payments

GET  /api/v1/payments

POST /api/v1/payments/stripe/webhook
```

### Customer Payment

```http
POST /api/v1/payments/create-checkout-session
```

Request:

```json
{
  "serviceRequestId": "SERVICE_REQUEST_ID"
}
```

### My Payments

```http
GET /api/v1/payments/my-payments
```

Supports:

```text
?page=1
&limit=10
&status=PAID
```

### Admin Payments

```http
GET /api/v1/payments
```

Supports:

```text
?page=1
&limit=10
&status=PAID
```

### Stripe Webhook

```http
POST /api/v1/payments/stripe/webhook
```

Stripe webhook updates payment status after successful checkout.

---

# ⭐ Reviews

```http
POST /api/v1/reviews
```

Request:

```json
{
  "serviceRequestId": "SERVICE_REQUEST_ID",
  "rating": 5,
  "comment": "Excellent service."
}
```

Requirements:

- Customer must own the service request
- Service request must be `COMPLETED`
- Payment must be `PAID`
- Only one review per service request
- Rating must be between 1 and 5

---

# 📋 Audit Logs

```http
GET /api/v1/audit-logs
```

Admin only.

Supported filters:

```text
?page=1
&limit=10
&action=PAYMENT_COMPLETED
&entity=Payment
&userId=USER_ID
```

Example:

```http
GET /api/v1/audit-logs?action=PAYMENT_COMPLETED
```

---

# 💳 Stripe Payment Flow

```text
Customer
   │
   ▼
Create Service Request
   │
   ▼
Admin Assigns Technician
   │
   ▼
Technician Accepts
   │
   ▼
Technician Starts Service
   │
   ▼
Technician Completes Service
   │
   ▼
Customer Creates Checkout
   │
   ▼
Stripe Checkout
   │
   ▼
Payment Successful
   │
   ▼
Stripe Webhook
   │
   ▼
Payment → PAID
   │
   ▼
AuditLog → PAYMENT_COMPLETED
   │
   ▼
Customer Creates Review
```

---

# 🔄 Service Request Workflow

```text
PENDING
   │
   ▼
ASSIGNED
   │
   ▼
ACCEPTED
   │
   ▼
IN_PROGRESS
   │
   ▼
COMPLETED
   │
   ▼
PAYMENT
   │
   ▼
REVIEW
```

Cancellation:

```text
PENDING
   │
   ▼
CANCELLED
```

---

# 🛡️ Security

FixFlow implements several security practices:

- Password hashing
- JWT authentication
- Role-based authorization
- Zod request validation
- Helmet
- CORS
- Secure environment variables
- Soft deletion
- Stripe webhook signature verification
- Protected Admin APIs
- Protected Technician APIs
- Protected Customer APIs
- Audit logging for critical actions

---

# 📊 Pagination

List APIs support pagination.

Example:

```http
GET /api/v1/payments?page=1&limit=10
```

Response:

```json
{
  "success": true,
  "message": "Payments retrieved successfully",
  "data": {
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    },
    "data": []
  }
}
```

---

# 🔎 Search, Filter & Sort

Service request APIs support:

- Search
- Status filtering
- City filtering
- Area filtering
- Sorting
- Pagination

Example:

```http
GET /api/v1/service-requests?status=PENDING&page=1&limit=10
```

---

# 🗑️ Soft Delete

Important resources use soft deletion instead of immediately removing records.

Example fields:

```prisma
isDeleted Boolean   @default(false)
deletedAt DateTime?
```

This helps preserve historical records and maintain system integrity.

---

# 🧾 Standard API Response

## Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Error

```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}
```

---

# 🧪 Testing

The API can be tested using:

- Postman
- Thunder Client
- Swagger UI

Recommended testing order:

```text
1. Register
2. Login
3. Create Service Category
4. Register Technician
5. Update Technician Profile
6. Admin Approves Technician
7. Customer Creates Service Request
8. Admin Assigns Technician
9. Technician Accepts
10. Technician Starts
11. Technician Completes
12. Customer Creates Stripe Checkout
13. Complete Stripe Payment
14. Verify Payment Status
15. Create Review
16. Check Audit Logs
```

---

# 👨‍💻 Demo Credentials

> These are demo/test credentials only. Do not use real production credentials in the README.

## Admin

```text
Email: admin@fixflow.com
Password: Password123!
```

## Customer

```text
Email: customer@fixflow.com
Password: Password123!
```

## Technician

```text
Email: technician@fixflow.com
Password: Password123!
```

---

# 🏗️ Architecture

FixFlow follows a modular backend architecture.

```text
Request
   │
   ▼
Route
   │
   ▼
Middleware
   │
   ├── Authentication
   ├── Authorization
   └── Validation
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
```

Each module follows:

```text
module/
├── interface.ts
├── validation.ts
├── service.ts
├── controller.ts
└── route.ts
```

---

# 🔄 Error Handling

The application uses centralized error handling.

Errors are processed through:

```text
globalErrorHandler
```

This keeps API responses consistent across the entire application.

---

# 📖 API Documentation

Swagger documentation is generated using OpenAPI and Redocly.

Generate Swagger bundle:

```bash
npm run swagger:docs
```

Then open:

### Local

```text
http://localhost:5000/api-docs
```

### Production

```text
https://fixflow-server.vercel.app/api-docs
```

---

# 🚀 Deployment

Before deployment, run:

```bash
npm run type-check
npm run lint:check
npm run format:check
npm run build
```

Make sure all production environment variables are configured.

### Stripe Production Checklist

- Use production Stripe secret key
- Configure production webhook endpoint
- Use production webhook signing secret
- Never expose Stripe secrets publicly

---

# 🔧 CI/CD

The project uses GitHub Actions for automated quality checks.

```text
Install Dependencies
       ↓
Prisma Generate
       ↓
OpenAPI Validation
       ↓
Swagger Build
       ↓
Biome Format Check
       ↓
Biome Lint Check
       ↓
Type Check
       ↓
Build
       ↓
Test
```

---

# 📌 Project Goals

The main goals of FixFlow are:

- Provide reliable field service management
- Connect customers with technicians
- Manage technician approval and assignments
- Provide secure online payments
- Track service lifecycle
- Maintain accountability through audit logs
- Provide a scalable REST API
- Follow real-world backend development practices

---

# 👨‍💻 Author

**MD Omar Faruk**

Full Stack Web Developer

### Technologies

```text
JavaScript
TypeScript
React
Next.js
Node.js
Express.js
PostgreSQL
Prisma
MongoDB
```

---

# 📄 License

This project is developed for educational and portfolio purposes.