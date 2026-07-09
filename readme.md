# RentNest API

An Airbnb-like multi-tenant rental marketplace engine built with Express, Prisma, and PostgreSQL, featuring secure distributed Stripe financial automation.

**Live URL:** https://rentnest.dibbockb.com/

## Tech Stack
- **Engine:** Node.js / Express (TypeScript)
- **Database:** PostgreSQL (Hosted via Neon)
- **ORM:** Prisma (Multi-schema architecture)
- **Payments:** Stripe API & Cryptographic Webhooks

## System Architecture Highlights
- **Role-Based Security:** Complete middleware isolation across Admin, Landlord, and Tenant actions.
- **Atomic Operations:** Payment states, contract requests, and room availability are processed using ACID transactions.
- **Production Performance:** Built-in persistence layers keeping the engine hot under free cloud-tier constraints.

## To-dos
- [ ] Implement Zod validation.
- [ ] Refactor generic exceptions into a structured custom error-handling matrix.
- [ ] Build multi-conditional SQL pagination and search indexing for property lists.
- [ ] Build logging function.
