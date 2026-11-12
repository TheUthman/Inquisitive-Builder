# Clerk setup — Inquisitive Builder

This project now uses Clerk for the administrator sign-in flow. The existing admin login layout is retained and Clerk handles credential verification and session management.

## 1. Install dependencies

From the project root:

```bash
npm install
```

This installs `@clerk/react` and updates `package-lock.json` for this project.

## 2. Create the Clerk application

1. Create an application in the [Clerk Dashboard](https://dashboard.clerk.com/).
2. Enable email address sign-in and password authentication.
3. For a single private administrator, disable public sign-ups in the Clerk Dashboard.
4. Create/invite your administrator account from the Clerk Dashboard. Do not add a public sign-up page to this portfolio.
5. Enable MFA for the administrator account. Email verification-code MFA is supported by the custom login screen; configure an email-code factor if you want that flow. You can also use Clerk's hosted account portal for additional recovery or verification methods.
6. Copy the **Publishable key** from the Clerk Dashboard.

## 3. Configure environment variables

Copy `.env.example` to `.env` and set:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
VITE_CLERK_ADMIN_USER_ID=user_your_clerk_user_id
VITE_API_BASE_URL=
```

The Clerk user ID is visible in the Clerk Dashboard user details. It is not a secret. It is used only to keep non-admin users out of the admin UI.

Never put `CLERK_SECRET_KEY` in a `VITE_` variable or in frontend code. The secret key belongs only in the future backend's server-side environment.

## 4. Run the frontend

```bash
npm run dev
```

Open `/admin` to sign in. `/admin/dashboard` redirects signed-out users to `/admin` and rejects a signed-in user whose Clerk user ID does not match `VITE_CLERK_ADMIN_USER_ID`.

## 5. Backend work still required

This integration prepares the frontend to send the current Clerk session JWT as a `Bearer` token on API requests. The current project does not yet contain a backend, so API-backed dashboard data and editing will remain unavailable until the API is implemented.

When the Spring Boot backend is added, it must:

- Verify Clerk JWT signatures, issuer, expiry and authorized party using Clerk's supported backend/JWT verification approach.
- Independently enforce the administrator user ID allowlist on every `/admin/**` endpoint.
- Reject missing, invalid, expired, or non-admin tokens with `401`/`403`.
- Never trust the frontend route guard or a user-supplied role as authorization.
- Keep the Clerk secret key and any signing/verification secrets on the server only.

The frontend route guard is a usability gate, not a security boundary. The backend is the final authority for access control.
