# 🔐 Full-Stack Authentication System

A production-ready authentication system built with:

- **Node.js**, **Express.js**, **MongoDB**
- **Zod** for request validation
- **JWT (Access & Refresh Tokens)** for stateless auth
- **Session management**, **Rate limiting**, **Two-Factor Authentication (2FA)**
- **Soft account deletion** (store for 15 days after deletion request)
- **React.js** (with ShadCN UI), **Redux Toolkit** for state management

---

## 📦 Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB & Mongoose
- Zod (validation)
- JWT (Access + Refresh Tokens)
- Redis (optional, for sessions or rate limiting)
- 2FA with OTP (e.g. using `speakeasy` or `otplib`)

### Frontend

- React.js (ESM + Vite/CRA)
- Redux Toolkit
- ShadCN UI (Radix UI + TailwindCSS)
- Axios (for API calls)

---

## 🚀 Features

### ✅ Authentication

- Email/password login
- Zod-based validation for safety
- Secure password hashing (e.g. bcrypt)
- JWT-based authentication
- Access & Refresh token rotation
- Token blacklist on logout or refresh theft

### ✅ Sessions & Rate Limiting

- Store user sessions in Redis or DB
- IP-based rate limiting to prevent brute-force
- Device/session tracking (optional)

### ✅ Two-Factor Authentication (2FA)

- Enable/disable 2FA from profile
- OTP secret generation + QR code
- TOTP verification (e.g. Google Authenticator)

### ✅ Account Management

- Update profile, change password
- Soft delete account (flagged and stored for 15 days)
- Permanent deletion after expiration

### ✅ Frontend UX

- ShadCN UI components
- Redux-based global auth state
- Route protection for private pages
- Toast notifications, loading states, 2FA modal

---
