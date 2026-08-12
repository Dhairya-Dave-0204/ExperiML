# ExperiML Authentication Architecture & Flow

## 1. Authentication Overview

ExperiML uses a token-based authentication architecture built around:

-   Node.js + Express as the primary backend.
-   PostgreSQL + Prisma for persistent user and session data.
-   `jsonwebtoken` for JWT creation and verification.
-   HS256 for JWT signing.
-   Short-lived access tokens stored only in frontend memory.
-   Long-lived refresh tokens stored in secure HTTP cookies.
-   Database-backed sessions for refresh-token lifecycle management.
-   Simple refresh-token rotation without token-family/reuse-detection
    logic in the current version.

### Authentication scope

``` text
Authentication
│
├── Sign Up
│   └── Create user
│
├── Sign In
│   ├── Validate credentials
│   ├── Create session
│   ├── Generate access token
│   └── Generate refresh token
│
├── Access Token
│   └── Authenticate protected requests
│
├── Refresh Token
│   └── Issue new access + refresh tokens
│
├── Logout
│   └── Invalidate session / refresh token
│
└── Authentication Middleware
    └── Protect authenticated routes
```

Later:

``` text
Forgot Password
      ↓
Reset Password
```

There will be no email verification or account verification flow in the
current version.

------------------------------------------------------------------------

## 2. Access Token vs Refresh Token

### Access token

The access token is:

-   A JWT.
-   Short-lived.
-   Used for normal authenticated API requests.
-   Stored only in frontend memory.
-   Sent using the `Authorization` header.

``` http
Authorization: Bearer <access-token>
```

The JWT should contain only the minimum information required by the
backend. Sensitive information such as passwords, password hashes, or
refresh tokens must not be placed inside it.

Conceptual payload:

``` json
{
  "sub": "user-id",
  "sessionId": "session-id",
  "type": "access",
  "iat": 1786500000,
  "exp": 1786500900
}
```

### Refresh token

The refresh token is:

-   Long-lived compared with the access token.
-   Used only to obtain new tokens.
-   Stored in an HttpOnly cookie.
-   Associated with a database-backed session.
-   Rotated when it is used.

The database stores a hash of the refresh token, not the raw token.

------------------------------------------------------------------------

## 3. JWT Library

The project will use:

``` text
jsonwebtoken
```

The library handles:

``` text
Create JWT
    ↓
Sign JWT
    ↓
Send access token to frontend
    ↓
Verify JWT on protected requests
    ↓
Extract claims
```

JWT creation and verification should be centralized in a token utility
rather than implemented directly inside controllers.

------------------------------------------------------------------------

## 4. JWT Algorithm

The selected algorithm is:

``` text
HS256
```

HS256 uses a shared secret:

``` text
Secret
   │
   ├── Sign token
   │
   └── Verify token
```

The secret remains on the backend and is stored in environment
variables. It must never be exposed to the frontend.

------------------------------------------------------------------------

## 5. Access Token Configuration

Selected strategy:

``` text
Type:       JWT
Algorithm:  HS256
Lifetime:   approximately 15 minutes
Storage:    frontend memory
Transport:  Authorization Bearer header
```

The short lifetime limits the useful lifetime of a stolen access token.

When it expires, the frontend uses the refresh-token flow instead of
forcing the user to sign in again.

------------------------------------------------------------------------

## 6. Access Token Storage

The access token will not be stored in:

``` text
localStorage
sessionStorage
```

Instead:

``` text
React Application
      │
      ▼
In-memory authentication state
      │
      └── accessToken
```

A full page refresh clears the access token from memory. The frontend
can then call `/auth/refresh`, allowing the backend to issue a new
access token using the refresh-token cookie.

Flow:

``` text
Page Refresh
     ↓
Access token gone from memory
     ↓
POST /auth/refresh
     ↓
Refresh cookie automatically sent
     ↓
Backend validates session
     ↓
New access token
     ↓
Store in frontend memory
```

------------------------------------------------------------------------

## 7. Refresh Token Storage

The refresh token will be stored in an:

``` text
HttpOnly cookie
```

This prevents normal frontend JavaScript from directly reading it.

Conceptually:

``` text
Browser
│
├── JavaScript memory
│      └── access token
│
└── HTTP cookie storage
       └── refresh token
```

The refresh cookie should use appropriate security attributes:

``` text
HttpOnly
Secure
SameSite
```

The exact `SameSite` value depends on the final frontend/backend
deployment arrangement.

------------------------------------------------------------------------

## 8. Why Not Store Tokens in localStorage?

The project intentionally avoids:

``` text
localStorage
├── accessToken
└── refreshToken
```

JavaScript can read localStorage. If malicious JavaScript executes
because of an XSS vulnerability, a refresh token stored there can be
directly accessed.

The selected architecture instead uses:

``` text
Access Token  → memory
Refresh Token → HttpOnly cookie
```

------------------------------------------------------------------------

## 9. Database Sessions

The authentication system uses the existing `Session` model.

Relationship:

``` text
User
 │
 ├── Session A
 ├── Session B
 └── Session C
```

A session represents a persistent authentication session.

Conceptually:

``` text
Session
├── id
├── userId
├── refreshTokenHash
├── expiresAt
├── revokedAt
├── createdAt
└── ...
```

The exact fields remain determined by the finalized Prisma schema.

Important principle:

``` text
Raw refresh token
       ↓
      hash
       ↓
Session.refreshTokenHash
```

The raw refresh token should not be persisted in PostgreSQL.

------------------------------------------------------------------------

## 10. Sign-Up Flow

``` text
Frontend
   │
   │ POST /api/v1/auth/register
   │
   │ email + password + user information
   ▼
Express Route
   │
   ▼
Auth Controller
   │
   ▼
Validation
   │
   ▼
Auth Service
   │
   ├── Check whether user already exists
   ├── Hash password
   └── Create User through Prisma
   │
   ▼
PostgreSQL
   │
   ▼
Successful response
```

Password storage:

``` text
Plain Password
      ↓
Password Hashing
      ↓
passwordHash
      ↓
PostgreSQL
```

------------------------------------------------------------------------

## 11. Sign-In Flow

``` text
Frontend
   │
   │ POST /api/v1/auth/login
   │
   │ email + password
   ▼
Express Route
   │
   ▼
Auth Controller
   │
   ▼
Validation
   │
   ▼
Auth Service
   │
   ├── Find user
   ├── Compare password
   ├── Create Session
   ├── Generate Access Token
   └── Generate Refresh Token
   │
   ├───────────────┐
   │               │
   ▼               ▼
Access Token    Refresh Token
   │               │
   ▼               ▼
Frontend        HttpOnly Cookie
Memory
```

The refresh-token hash is stored in the session.

------------------------------------------------------------------------

## 12. Normal Authenticated Request

``` text
React
  │
  │ GET /api/v1/projects
  │ Authorization: Bearer <access-token>
  ▼
Express Route
  │
  ▼
Authentication Middleware
  │
  ├── Extract token
  ├── Verify JWT
  ├── Validate token type
  └── Extract user/session information
  │
  ▼
req.user
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

The controller does not decode authentication information itself.

------------------------------------------------------------------------

## 13. Access Token Expiration and Refresh

``` text
Frontend
   │
   │ POST /api/v1/auth/refresh
   │
   │ Refresh token cookie automatically sent
   ▼
Express
   │
   ▼
Auth Controller
   │
   ▼
Auth Service
   │
   ├── Validate refresh token
   ├── Find session
   ├── Check session validity
   └── Rotate refresh token
   │
   ├───────────────┐
   │               │
   ▼               ▼
New Access       New Refresh
Token            Token
   │               │
   ▼               ▼
Frontend        HttpOnly Cookie
Memory
```

------------------------------------------------------------------------

## 14. Refresh Token Rotation

The selected strategy is simple refresh-token rotation.

Token-family tracking and sophisticated reuse detection are
intentionally not included in the current version.

Sequence:

``` text
Refresh Token A
       ↓
/auth/refresh
       ↓
Validate A
       ↓
Invalidate/replace A
       ↓
Generate Refresh Token B
       ↓
Generate new Access Token
```

Then:

``` text
A → B → C → D → E
```

Each successful refresh replaces the previous refresh token.

The session's stored refresh-token hash is updated to represent the new
refresh token.

### Why simple rotation?

It provides a useful security improvement over reusing one long-lived
refresh token without introducing the complexity of token families and
reuse detection.

Future versions can add token-family tracking if required.

------------------------------------------------------------------------

## 15. Logout Flow

Logout invalidates the backend session rather than only clearing
frontend state.

``` text
Frontend
   │
   │ POST /api/v1/auth/logout
   ▼
Express
   │
   ▼
Authentication / Session validation
   │
   ▼
Auth Service
   │
   ▼
Revoke Session
   │
   └── revokedAt = current time
   │
   ▼
Clear refresh-token cookie
   │
   ▼
Frontend clears access token from memory
```

After logout:

``` text
Access Token
     ↓
removed from frontend memory

Refresh Token
     ↓
cookie cleared

Session
     ↓
revoked
```

------------------------------------------------------------------------

## 16. Authentication Middleware

Protected endpoints use authentication middleware:

``` text
authenticate
    ↓
Extract Authorization header
    ↓
Extract Bearer token
    ↓
Verify JWT
    ↓
Validate token type
    ↓
Extract user/session information
    ↓
Attach authenticated context to req
    ↓
next()
```

Invalid authentication should produce an appropriate `ApiError`, which
is then handled by the global error middleware.

------------------------------------------------------------------------

## 17. Error Handling Integration

Authentication uses the existing shared backend error architecture:

``` text
Controller / Service
       │
       │ throw ApiError
       ▼
asyncHandler
       │
       ▼
Express
       │
       ▼
Global Error Middleware
       │
       ▼
Standardized Error Response
```

Example:

``` js
throw new ApiError(
  401,
  "Invalid credentials.",
);
```

Response:

``` json
{
  "statusCode": 401,
  "data": null,
  "message": "Invalid credentials.",
  "success": false,
  "errors": []
}
```

Unexpected internal errors should not expose internal implementation
details to clients.

------------------------------------------------------------------------

# 18. Complete Frontend + Backend Architecture

``` text
                         ┌───────────────────┐
                         │      React        │
                         │     Frontend      │
                         └─────────┬─────────┘
                                   │
                         HTTP / API Requests
                                   │
                                   ▼
                         ┌───────────────────┐
                         │      Express      │
                         │      Backend      │
                         └─────────┬─────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
                 Routes       Middleware     Controllers
                                   │              │
                                   │              ▼
                                   │          Auth Service
                                   │              │
                                   │              ▼
                                   │       Prisma Client
                                   │              │
                                   │              ▼
                                   │         PostgreSQL
                                   │
                                   ▼
                          Authentication
                           Middleware
                                   │
                                   ▼
                              req.user
```

------------------------------------------------------------------------

# 19. Login: Full Frontend-to-Database Flow

``` text
┌──────────────┐
│ React Login  │
│    Form      │
└──────┬───────┘
       │
       │ email + password
       ▼
┌────────────────────┐
│ POST /auth/login   │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ Auth Controller    │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ Auth Service       │
│                    │
│ Find User          │
│ Compare Password   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│     PostgreSQL     │
│       User         │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Create Session     │
└─────────┬──────────┘
          │
          ├───────────────┐
          ▼               ▼
┌────────────────┐  ┌─────────────────┐
│ Access Token   │  │ Refresh Token   │
│ JWT / 15 min   │  │ Long-lived      │
└───────┬────────┘  └────────┬────────┘
        │                    │
        ▼                    ▼
 React Memory         HttpOnly Cookie
```

------------------------------------------------------------------------

# 20. Normal Protected Request: Full Flow

``` text
┌─────────────────┐
│ React Frontend  │
└────────┬────────┘
         │
         │ Authorization: Bearer JWT
         ▼
┌─────────────────┐
│ Express Route   │
└────────┬────────┘
         ▼
┌────────────────────────┐
│ Authentication         │
│ Middleware             │
│                        │
│ Verify JWT             │
│ Validate claims        │
└────────┬───────────────┘
         │
         ▼
      req.user
         │
         ▼
┌─────────────────┐
│ Controller      │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Service         │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Prisma Client   │
└────────┬────────┘
         ▼
┌─────────────────┐
│ PostgreSQL      │
└─────────────────┘
```

------------------------------------------------------------------------

# 21. Access Token Refresh: Full Flow

``` text
┌─────────────────────┐
│ Access Token        │
│ expires             │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ React Frontend      │
└──────────┬──────────┘
           │
           │ POST /auth/refresh
           │
           │ Refresh cookie automatically sent
           ▼
┌─────────────────────┐
│ Express             │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Auth Controller     │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Auth Service        │
│                     │
│ Validate token      │
│ Find session        │
│ Check expiration    │
│ Check revocation    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ PostgreSQL          │
│ Session             │
└──────────┬──────────┘
           │
           ▼
    Rotate refresh token
           │
      ┌────┴─────┐
      ▼          ▼
 New Access   New Refresh
   Token         Token
      │          │
      ▼          ▼
React Memory  HttpOnly Cookie
```

------------------------------------------------------------------------

# 22. Logout: Full Flow

``` text
┌─────────────────┐
│ React Frontend  │
└────────┬────────┘
         │
         │ POST /auth/logout
         ▼
┌─────────────────┐
│ Express         │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Auth Controller │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Auth Service    │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Prisma          │
│                 │
│ Revoke Session  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ PostgreSQL      │
└────────┬────────┘
         │
         ▼
Clear refresh cookie
         │
         ▼
Clear access token
from React memory
```

------------------------------------------------------------------------

# 23. Complete Authentication Lifecycle

``` text
                           SIGN UP
                              │
                              ▼
                        Create User
                              │
                              ▼
                           SIGN IN
                              │
                  ┌───────────┴───────────┐
                  │                       │
                  ▼                       ▼
            Access Token            Refresh Token
             (15 min)              (HttpOnly Cookie)
                  │                       │
                  ▼                       ▼
          React Memory              Session DB
                  │                       │
                  ▼                       │
         Protected Requests              │
                  │                       │
                  ▼                       │
          Access Token Expires            │
                  │                       │
                  └───────────┬───────────┘
                              ▼
                         /auth/refresh
                              │
                              ▼
                    Validate Session/Token
                              │
                              ▼
                       Rotate Refresh
                              │
                  ┌───────────┴───────────┐
                  ▼                       ▼
            New Access Token        New Refresh Token
                  │                       │
                  ▼                       ▼
             React Memory          HttpOnly Cookie
                                          │
                                          ▼
                                       Session

                           LOGOUT
                              │
                  ┌───────────┴───────────┐
                  ▼                       ▼
           Clear frontend          Revoke Session
              memory                     │
                                        ▼
                                  Clear Cookie
```

------------------------------------------------------------------------

# 24. Authentication Module Structure

The authentication feature will be separated from generic
infrastructure:

``` text
src/
└── modules/
    └── auth/
        ├── auth.controller.js
        ├── auth.service.js
        ├── auth.routes.js
        ├── auth.validation.js
        └── auth.constants.js
```

Supporting utilities:

``` text
src/
├── config/
│
├── infrastructure/
│   └── clients/
│       └── prisma.client.js
│
├── middleware/
│   ├── error.middleware.js
│   └── auth.middleware.js
│
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   ├── password.util.js
│   └── token.util.js
│
└── modules/
    └── auth/
```

------------------------------------------------------------------------

# 25. Final Authentication Decisions

  Decision                         Final Choice
  -------------------------------- ------------------------------------
  Authentication model             JWT + database-backed sessions
  JWT library                      `jsonwebtoken`
  JWT algorithm                    HS256
  Access token                     Short-lived JWT
  Access token lifetime            \~15 minutes
  Access token storage             Frontend memory
  Access token transport           `Authorization: Bearer`
  Refresh token                    Long-lived token
  Refresh token storage            HttpOnly cookie
  Refresh token database storage   Hash only
  Refresh strategy                 Simple rotation
  Token family                     Not implemented in current version
  Reuse detection                  Not implemented in current version
  Session revocation               Supported
  Password storage                 Password hash only
  Email verification               Not implemented
  Account verification             Not implemented
  Forgot password                  Later
  Reset password                   Later

------------------------------------------------------------------------

# 26. Security Principles

1.  Never store plaintext passwords.
2.  Never store raw refresh tokens in PostgreSQL.
3.  Never expose JWT secrets to the frontend.
4.  Keep access tokens short-lived.
5.  Keep access tokens out of localStorage.
6.  Keep refresh tokens in HttpOnly cookies.
7.  Validate access tokens in authentication middleware.
8.  Validate refresh-token sessions against the database.
9.  Rotate refresh tokens after successful refresh.
10. Revoke sessions during logout.
11. Do not expose unexpected internal errors to clients.
12. Keep authentication logic in the auth module.
13. Keep Prisma connection management centralized in the Prisma client.
14. Keep server lifecycle management in `server.js`.

------------------------------------------------------------------------

# 27. Implementation Order

``` text
1. Install/configure jsonwebtoken
          ↓
2. Define JWT/auth environment variables
          ↓
3. Create password utility
          ↓
4. Create token utility
          ↓
5. Create authentication validation
          ↓
6. Implement auth service
          ↓
7. Implement auth controller
          ↓
8. Implement auth routes
          ↓
9. Implement authentication middleware
          ↓
10. Configure cookies/CORS as required
          ↓
11. Register auth routes in app.js
          ↓
12. Test sign-up
          ↓
13. Test sign-in
          ↓
14. Test protected request
          ↓
15. Test refresh + rotation
          ↓
16. Test logout
          ↓
17. Integrate frontend authentication
          ↓
18. Later: forgot password + reset password
```

## Final Architecture Summary

``` text
                    ┌─────────────────────┐
                    │     React Client    │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  │                         │
           Access Token               Refresh Token
           Memory only               HttpOnly Cookie
                  │                         │
                  │                         │
                  ▼                         ▼
          Authorization              /auth/refresh
             Bearer                       │
                  │                       ▼
                  │                Session Validation
                  │                       │
                  ▼                       ▼
             Express                 PostgreSQL
                  │                       │
          Authentication                 │
             Middleware                  │
                  │                       │
                  ▼                       │
              req.user                   │
                  │                       │
                  ▼                       │
             Controller                  │
                  │                       │
                  ▼                       │
              Service                    │
                  │                       │
                  └───────────┬───────────┘
                              ▼
                        Prisma Client
                              │
                              ▼
                         PostgreSQL
```

This document represents the **current V1 authentication decision set**.
Future enhancements such as refresh-token families/reuse detection,
stronger asymmetric JWT signing, email verification, and password
recovery will be treated as separate additions rather than assumed parts
of the current implementation.
