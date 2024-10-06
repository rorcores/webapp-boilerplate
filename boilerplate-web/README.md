# MyBoilerplate Front-End

MyBoilerplate is a Next.js / Vercel project.

## Environments

1. **Local**: Hosted on your localhost
2. **Dev**: Hosted at: (not up yet)
3. **Prod**: Hosted at: (not up yet)

## REPOS:

**web**: This repo - handles the front-end.

**server**: The server repo, handles the back-end and talks to supabase.

## Web Deploys

To deploy a new Vercel version, just push to the `dev` or `prod` branch.

## Server Deploys

To deploy a new server, push to `dev` or `prod` and Heroku will handle the rest (it listens for changes to those branches).

## Keys and Access

The client repo uses the anon key and the server uses the service key. RLS is enabled on supabase with no policies.

## VERSION TRACKING CHANGES:

Please use branches to merge into dev.
And them, use -ff method to merge dev to prod.

```bash
git merge dev --ff-only
```

## DATABASE DEPLOYS:

The database is on supabase. Right now I don't have a great way of managing database updates. Please check the separate 'DB_SETUP' readme if you ever need to build a new supabase from scratch.

# ENDPOINTS

# API Endpoints Documentation

This document provides an overview of the available API endpoints, grouped by their respective sections, including their rate limiting configurations and authentication requirements.

---

## User Endpoints

### 1. `POST user/v1/create-new-user`

**Description**: Creates a new user account in the system.

- **Rate Limiting**: 5 requests per IP per 10 minutes.
- **Requires Authentication**: No.
- **Rate Limiter Middleware**: `userCreateRateLimiter`

---

### 2. `POST user/v1/log-user-in-via-otp-link`

**Description**: Sends a One-Time Password (OTP) to the user for authentication.

- **Rate Limiting**: 5 requests per IP per 15 minutes.
- **Requires Authentication**: No.
- **Rate Limiter Middleware**: `otpRateLimiter`

---

### 3. `GET user/v1/check-if-user-exists`

**Description**: Checks if a user exists in the database based on the authenticated email.

- **Rate Limiting**: 120 requests per IP per minute.
- **Requires Authentication**: Yes.
- **Rate Limiter Middleware**: `checkIfUserExistsRateLimiter`

---

### 4. `POST user/v1/check-if-username-exists`

**Description**: Checks if the provided username exists in the database. If the username belongs to the authenticated user (same email), the user can proceed with updates; otherwise, it reports the username as taken.

- **Rate Limiting**: 120 requests per IP per minute.
- **Requires Authentication**: Yes.
- **Rate Limiter Middleware**: `checkIfUsernameExistsRateLimiter`

---

### 5. `POST user/v1/update-users-profile-information`

**Description**: Updates the user's profile information.

- **Rate Limiting**: 10 requests per IP per 15 minutes.
- **Requires Authentication**: Yes.
- **Rate Limiter Middleware**: `updateUserRateLimiter`

---

### 6. `GET user/v1/get-users-profile-information`

**Description**: Retrieves user data, such as credits and tickets.

- **Rate Limiting**: 120 requests per IP per minute.
- **Requires Authentication**: Yes.
- **Rate Limiter Middleware**: `getUserDataRateLimiter`

---

### 7. `POST user/v1/log-sign-out-event`

**Description**: Logs the sign out of a user from the application.

- **Rate Limiting**: 25 requests per IP per 15 minutes.
- **Requires Authentication**: Yes.
- **Rate Limiter Middleware**: `signOutRateLimiter`

---

## Additional Notes:

- All endpoints with **"Requires Authentication"** require the user to provide a valid JWT token in the `Authorization` header.
- Rate limiting settings help prevent abuse and overuse of the API endpoints, with responses adhering to the configured limits.
