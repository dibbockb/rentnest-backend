# RentNest API

An Airbnb-like multi-tenant rental marketplace engine built with Express, Prisma, and PostgreSQL, featuring secure distributed Stripe financial automation.

**Live URL:** https://rentnest.dibbockb.com/

## Tech Stack
- **Engine:** Node.js / Express (TypeScript)
- **Database:** PostgreSQL (Hosted via Neon)
- **ORM:** Prisma (Multi-schema architecture)
- **Payments:** Stripe API & Cryptographic Webhooks

## API Endpoints Blueprint

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user account (Tenant/Landlord).
- `POST /api/auth/login` - Authenticate credentials and issue session cookies.
- `POST /api/auth/refresh-token` - Rotate and issue a fresh access token.
- `POST /api/auth/change-password` - Update account security credentials (Protected).

### 🏠 Property Catalog (`/api/properties`)
- `POST /api/properties/create-property` - List a new rental property (Landlord only).
- `GET /api/properties` - Retrieve all active, verified property listings.
- `GET /api/properties/categories` - Fetch all available system categories.
- `GET /api/properties/:id` - Fetch comprehensive details for a specific listing.

### 📋 Rental Lifecycle & Requests (`/api/rental`)
- `POST /api/rental/create-rental-request` - Submit a booking/lease request for a property (Tenant only).
- `GET /api/rental/tenant-requests` - View all historical rental bookings for the active tenant.

### 🛠️ Landlord Operations (`/api/landlord`)
- `GET /api/landlord/requested-rentals` - View all incoming booking requests submitted by tenants.
- `PATCH /api/landlord/approve-rental/:id` - Approve a pending tenant request, preparing it for checkout.
- `PATCH /api/landlord/reject-rental/:id` - Reject a tenant request.

### 💳 Financials & Stripe Gateway (`/api/payments`)
- `POST /api/payments/create-checkout-session` - Generate a secure Stripe checkout session for an approved rental request.
- `POST /api/payments/webhook` - Cryptographically signed handler parsing raw Stripe event buffers (`checkout.session.completed`).

### 👑 System Administration (`/api/admin`)
- `GET /api/admin/requested-properties` - Audit log of all properties waiting for system approval.
- `PATCH /api/admin/approve-property/:id` - Approve a property to make it go live globally.
- `PATCH /api/admin/reject-property/:id` - Deny or delist a property listing.

---

## Ongoing Development Backlog
- [x] Implement Zod payload validation across all public request routers.
- [x] Refactor generic exceptions into a structured custom error-handling matrix.
- [ ] Mandate `secure: true` across authentication cookie flags for strict SSL cross-subdomain handshakes.
- [ ] Build SQL pagination and search indexing for property lists.