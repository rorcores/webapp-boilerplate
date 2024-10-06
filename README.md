
# Complete Web App Boilerplate

This is a complete, detailed re-usable boilerplate for a web app by **Rory Garton-Smith**.  
It uses **TypeScript + React**, **Next.js/Vercel** for the front end, **Supabase** for the database, and **Express + Node.js** for the back end.

## Features:
1. Proper separation of Server/Client request via sanitized and rate limited endpoints
2. Uses JWT parsing to auth the user on 'authenticated' endpoints for security
4. OTP-style login
5. User input sanitation
6. Boilerplate login screen, auth details collection page, and home page
7. Boilerplate Terms & Conditions and Privacy Policy pages
8. Optional analytics integration (Umami)
9. User context at the top level to minimize repeated useEffect-style calls on components
10. Uses the modern approach to Next JS focused around the app/ folder but keeps T&C and Priv Pol on pages route for easy deep-linking (this is necessary for a lot of modern SAAS providers)
11. Custom fonts/custom CSS is all supported, check the public route for fonts and the globals CSS in the web app for how to wrap them

## Contributions:

Contributions to this project are welcome by anyone. Please submit a PR into the main branch.


![Screenshot 2024-10-06 at 12 05 26 PM](https://github.com/user-attachments/assets/559439b1-f9c5-42eb-a548-be73020284a4)

---

## Initial Setup:

1. Make an account on [Supabase](https://supabase.com/)
2. Run the SQL in the `DB_Setup.md` file to create the `users` table
3. Enable Row-Level Security (RLS) in Supabase
4. (Optional) Create an Umami account for analytics tracking
5. Create accounts on [Vercel](https://vercel.com/) and [Heroku](https://www.heroku.com/)

---

## Repo Setup:

1. Create two new repositories based on the directories `boilerplate-web` and `boilerplate-server`.
2. In `boilerplate-server`, create a `.env` file with the following values:

```env
SUPABASE_URL="insert_here"
SUPABASE_KEY="insert_here"
SUPABASE_JWT_SECRET="insert_here"
UMAMI_URL="https://cloud.umami.is/api/send"
UMAMI_WEBSITE_ID="insert_here"
```

3. In `boilerplate-web`, create a `.env.local` file with the following values:

```env
NEXT_PUBLIC_SUPABASE_URL="insert_here"
NEXT_PUBLIC_SUPABASE_ANON_KEY="insert_here"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_WS_URL="ws://localhost:3000"
NEXT_PUBLIC_UMAMI_WEBSITE_ID="insert_here"
```

---

## Important Note:
Use the **Supabase service worker key** only in the server.  
Use the **anon key** in the web app.
Please **ensure RLS is enabled** in your supabase table.

---

## Cleanup:

- Search and replace all instances of `MyCompany` with your company name.
- Search and replace all instances of `MyProject` with your project/app name.

---

## To Run:

```bash
npm run dev
```

Run the command in both `boilerplate-server` and `boilerplate-web` directories. Do it in the server first, the server doesn't like when localhost 3000 is already taken.


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

**Description**: Retrieves user data

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
