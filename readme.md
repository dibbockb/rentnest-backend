# 🏡 RentNest API Engine

An Airbnb-like multi-tenant rental marketplace engine built with Express, Prisma, and PostgreSQL, featuring secure distributed Stripe financial automation.

**Live URL:** https://rentnest.dibbockb.com/

## Tech Stack
- **Engine:** Node.js / Express (TypeScript)
- **Database:** PostgreSQL (Hosted via Neon)
- **ORM:** Prisma (Multi-schema architecture)
- **Payments:** Stripe API & Cryptographic Webhooks

---

## 🛠 Tech Stack & Core Infrastructure

* **Runtime:** Node.js
* **Framework:** Express
* **Database Engine:** PostgreSQL
* **Data Modeling Layer:** Prisma ORM (Multi-schema split-architecture)
* **Financial Orchestration:** Stripe API Suite & Cryptographic Event Webhooks
* **Security & Identity:** JWT State Sessions (HTTP-Only Cookies)

---

## 🔒 Global Router & Middleware Behaviors

### 👤 Role-Based Access Control Matrix
All secure endpoints consume an internal structural guard `auth(...allowedRoles)`. This gateway evaluates the signed `accessToken` passed automatically via cookies:
1. **Authentication Guard:** Parses incoming JWT payloads. If a user is flagged as `is_banned: true` in the database, the pipe immediately cuts off with a `403 Forbidden` response.
2. **Structural Validation Guard:** Public payloads pass through `validateRequest(zodSchema)` to ensure type-safe integrity before database exposure.

---

## 🗺 API Blueprint & Route Manifest

### 🔑 Authentication Module (`/api/auth`)

| HTTP Method | Route Endpoint | Middleware Constraints | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | `validateRequest(registerSchema)` | Registers a tenant or landlord account into the system; encrypts passwords using bcrypt. |
| **POST** | `/api/auth/login` | `validateRequest(loginSchema)` | Authenticates credentials; sets secure, `httpOnly` cookie tokens (`accessToken` & `refreshToken`). |
| **POST** | `/api/auth/refresh-token` | *Public (Reads refresh cookie)* | Validates the current session refresh token and issues a new rolling access cookie. |
| **GET** | `/api/auth/me` | `auth(ADMIN, LANDLORD, TENANT)` | Extracts credentials from the active cookie session and returns the complete profile metadata (excluding password). |

---

### 🏢 Property Catalog Module (`/api/properties`)

| HTTP Method | Route Endpoint | Middleware Constraints | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/properties` | *None (Public)* | Retrieves active, unbooked properties. Supports exact search string parsing via query limits (`?location=`, `?price=`, `?category=`). |
| **GET** | `/api/properties/categories` | *None (Public)* | Pulls an aggregated alphabetical lookup table of all property category tags. |
| **GET** | `/api/properties/:id` | *None (Public)* | Fetches deep, relational metadata for an individual property listing. |
| **POST** | `/api/properties/newlisting` | `validateRequest(createPropertySchema)`, `auth(ADMIN, LANDLORD)` | Inserts a new listing; executes a dynamic `connectOrCreate` mapping for categories. |
| **PUT** | `/api/properties/update/:id` | `validateRequest(updatePropertySchema)`, `auth(LANDLORD, ADMIN)` | Modifies properties. Validates that the updating user matches the listing's original `landlord_id`. |

---

### 📑 Rental Module (`/api/rental`)

| HTTP Method | Route Endpoint | Middleware Constraints | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/rental/my-requests` | `auth(ADMIN, TENANT)` | Lists historical booking applications initiated by the calling tenant. |
| **GET** | `/api/rental/:id` | `auth(ADMIN, TENANT)` | Detailed audit trail for an active request block. Enforces strict creator validation. |
| **POST** | `/api/rental/:id` | `auth(TENANT)` | Submits a formal booking application against an active property listing ID. |
| **POST** | `/api/rental/review/:propertyId` | `validateRequest(reviewSchema)`, `auth(TENANT)` | Appends user reviews. Validates that the request has a `COMPLETED` rental cycle status for that listing. |

---

### 👨‍💼 Landlord Operations Module (`/api/landlord`)

| HTTP Method | Route Endpoint | Middleware Constraints | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/landlord/properties` | `auth(LANDLORD)` | Isolates and returns only the active listings hosted by the authenticated landlord. |
| **GET** | `/api/landlord/requests` | `auth(LANDLORD)` | Retrieves all booking requests applied to properties owned by this landlord. |
| **PATCH** | `/api/landlord/properties/:requestId` | `auth(LANDLORD)` | Manages a request. Accepts an `?accept=true/false` query string, updating the record status. |
| **DELETE** | `/api/landlord/:id` | `auth(ADMIN, LANDLORD)` | Destroys a listing. Verifies that the user is an administrator or the explicit creator. |

---

### 💳 Financial Automation (`/api/payments`)

| HTTP Method | Route Endpoint | Middleware Constraints | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/payments/create/:rentalRequestId` | `auth(TENANT)` | Verifies that a request is marked `APPROVED` and spins up a secure Stripe Session URL. |
| **POST** | `/api/payments/webhook` | *Public (Enforces Raw Buffer Payload)* | Captures `checkout.session.completed` events, processes a safe multi-step atomic transactional query, updates statuses, and locks down property availability. |
| **GET** | `/api/payments/` | `auth(TENANT, ADMIN)` | Feeds a chronologically descending payment statement trace belonging to the caller. |
| **GET** | `/api/payments/:id` | *None (Reads route params)* | Fetches specific details for a discrete transaction block by matching its internal `transaction_id` tracking code. |

---

### 👑 System Moderation (`/api/admin`)

| HTTP Method | Route Endpoint | Middleware Constraints | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/admin/users` | `auth(ADMIN)` | Audits all application user profiles across the entire system engine (omits password blocks). |
| **GET** | `/api/admin/properties` | `auth(ADMIN)` | System-wide raw directory extract of listed inventories. |
| **GET** | `/api/admin/rentals` | `auth(ADMIN)` | Global real-time ledger recording every booking request across the ecosystem. |
| **PATCH** | `/api/admin/users/:id` | `validateRequest(moderateUserSchema)`, `auth(ADMIN)` | Overwrites system credentials or enforces account status updates (`is_banned: true`). |

---

## Local Development

### 1. Environment Variable Requirements (`.env`)
Create a `.env` file in the root directory configured with these exact keys:
```env
PORT=
APP_URL=
FRONTEND_URL=
DATABASE_URL=
BCRYPT_SALT_ROUNDS=
JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRY=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 2. Runtime Boot Checklist

```bash
# Install package ecosystem dependencies
pnpm install

# Spin up the typescript execution watch engine
pnpm dev

```

### 3. Simulating Stripe Webhook Events locally

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

---
## Ongoing Development
- [x] Implement Zod payload validation across all public request routers.
- [x] Refactor generic exceptions into a structured custom error-handling matrix.
- [ ] Mandate `secure: true` for production environment.
- [ ] Build SQL pagination and search indexing for property lists.