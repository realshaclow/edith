# 🔐 EDITH Research Platform - Authentication API Documentation

## 📋 Overview

System autoryzacji platformy EDITH oparty jest na JWT (JSON Web Tokens) z obsługą refresh tokenów, kontrolą dostępu opartą na rolach (RBAC) i zaawansowanymi mechanizmami bezpieczeństwa.

## 🛡️ Security Features

- **JWT Authentication** - Access & Refresh tokens
- **Role-Based Access Control (RBAC)** - 7 poziomów uprawnień
- **Password Security** - bcrypt z 12 rundami, walidacja siły hasła
- **Rate Limiting** - ochrona przed atakami brute force
- **Session Management** - śledzenie i zarządzanie sesjami użytkowników
- **Account Security** - blokowanie konta po nieudanych próbach logowania

---

## 👥 User Roles & Permissions

### Role Hierarchy:
1. **SUPER_ADMIN** - Pełny dostęp do systemu
2. **ADMIN** - Zarządzanie użytkownikami i wszystkimi zasobami
3. **MANAGER** - Zarządzanie projektami i protokołami
4. **RESEARCHER** - Tworzenie i wykonywanie badań
5. **OPERATOR** - Wykonywanie badań i wprowadzanie danych
6. **USER** - Podstawowy dostęp do odczytu
7. **GUEST** - Ograniczony dostęp tylko do odczytu

### Permission Matrix:

| Permission | SUPER_ADMIN | ADMIN | MANAGER | RESEARCHER | OPERATOR | USER | GUEST |
|------------|-------------|-------|---------|------------|----------|------|-------|
| SYSTEM_ADMIN | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| USER_MANAGEMENT | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| PROTOCOL_CREATE | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| PROTOCOL_READ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| PROTOCOL_UPDATE | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| PROTOCOL_DELETE | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| STUDY_CREATE | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| STUDY_READ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| STUDY_UPDATE | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| STUDY_DELETE | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| STUDY_EXECUTE | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| DATA_READ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| DATA_WRITE | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| DATA_DELETE | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| REPORT_VIEW | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| REPORT_EXPORT | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| AUDIT_VIEW | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🚀 Quick Start

### Default Users (Created by Seed)

```bash
# Administrator
Email: admin@edith.pl
Password: Admin123!@#
Role: SUPER_ADMIN

# Researcher  
Email: researcher@edith.pl
Password: Research123!
Role: RESEARCHER

# Operator
Email: operator@edith.pl
Password: Operator123!
Role: OPERATOR
```

⚠️ **IMPORTANT:** Change default passwords after first login!

### Basic Authentication Flow

```javascript
// 1. Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@edith.pl',
    password: 'Admin123!@#'
  })
});

const { data } = await response.json();
const { user, tokens } = data;

// 2. Store tokens
localStorage.setItem('accessToken', tokens.accessToken);
// Refresh token is stored as httpOnly cookie automatically

// 3. Use token for authenticated requests
const authResponse = await fetch('/api/protected-endpoint', {
  headers: {
    'Authorization': `Bearer ${tokens.accessToken}`
  }
});
```

---

## 📡 API Endpoints

### Base URL: `/api/auth`

---

## 📝 Authentication Endpoints

### 🔑 POST `/register` - Register New User

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "username": "jkowalski",
  "title": "Dr",
  "affiliation": "Uniwersytet Badawczy",
  "department": "Wydział Techniczny",
  "position": "Adiunkt",
  "phone": "+48123456789"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxyz123...",
      "email": "user@example.com",
      "firstName": "Jan",
      "lastName": "Kowalski",
      "role": "USER",
      "isActive": true,
      "isVerified": false,
      "createdAt": "2025-09-03T10:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    }
  },
  "message": "Rejestracja zakończona pomyślnie"
}
```

**Validation Rules:**
- Email: Valid email format, unique
- Password: Min 8 chars, uppercase, lowercase, number, special char
- Username: Optional, unique if provided
- Name fields: Required, min 2 characters

**Rate Limit:** 3 requests per hour per IP

---

### 🔑 POST `/login` - User Login

Authenticate user and receive access tokens.

**Request Body:**
```json
{
  "email": "admin@edith.pl",
  "password": "Admin123!@#",
  "rememberMe": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxyz123...",
      "email": "admin@edith.pl",
      "firstName": "Administrator",
      "lastName": "Systemu",
      "role": "SUPER_ADMIN",
      "isActive": true,
      "isVerified": true,
      "lastLoginAt": "2025-09-03T09:45:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    }
  },
  "message": "Logowanie zakończone pomyślnie"
}
```

**Error Responses:**
```json
// Invalid credentials
{
  "success": false,
  "error": "Nieprawidłowy email lub hasło"
}

// Account locked
{
  "success": false,
  "error": "Konto zostało zablokowane do 2025-09-03 10:15:00"
}

// Account inactive
{
  "success": false,
  "error": "Konto zostało dezaktywowane"
}
```

**Security Features:**
- Account lockout after 5 failed attempts (15 minutes)
- Session tracking with IP and User Agent
- Rate limiting: 5 attempts per 15 minutes per IP

**Rate Limit:** 5 requests per 15 minutes per IP

---

### 🔑 POST `/logout` - User Logout

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Wylogowanie zakończone pomyślnie"
}
```

**Actions Performed:**
- Invalidates current session
- Blacklists access token
- Clears refresh token cookie

---

### 🔑 POST `/refresh-token` - Refresh Access Token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Note:** Refresh token can also be sent via httpOnly cookie (automatically)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  }
}
```

---

## 👤 Profile Management

### 👤 GET `/profile` - Get User Profile

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clxyz123...",
    "email": "admin@edith.pl",
    "username": "admin",
    "firstName": "Administrator",
    "lastName": "Systemu",
    "title": "Administrator",
    "affiliation": "EDITH Research Platform",
    "department": "IT",
    "position": "System Administrator",
    "phone": null,
    "avatar": null,
    "role": "SUPER_ADMIN",
    "isActive": true,
    "isVerified": true,
    "language": "pl",
    "timezone": "Europe/Warsaw",
    "preferences": null,
    "lastLoginAt": "2025-09-03T09:45:00.000Z",
    "createdAt": "2025-09-03T08:00:00.000Z",
    "updatedAt": "2025-09-03T09:45:00.000Z"
  }
}
```

---

### 👤 PUT `/profile` - Update User Profile

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "firstName": "Jan",
  "lastName": "Nowak",
  "title": "Prof. dr hab.",
  "affiliation": "Politechnika Warszawska",
  "department": "Wydział Chemiczny",
  "position": "Profesor",
  "phone": "+48123456789",
  "language": "en",
  "timezone": "Europe/London",
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "autoSave": true
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clxyz123...",
    "email": "admin@edith.pl",
    "firstName": "Jan",
    "lastName": "Nowak",
    // ... updated fields
  },
  "message": "Profil został zaktualizowany"
}
```

---

## 🔐 Password Management

### 🔐 POST `/change-password` - Change Password

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "Admin123!@#",
  "newPassword": "NewSecurePassword456$"
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

**Security Actions:**
- Validates current password
- Validates new password strength
- Revokes all active sessions except current one
- Forces re-authentication

---

### 🔐 POST `/forgot-password` - Request Password Reset

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Jeśli podany adres email jest zarejestrowany, wkrótce otrzymasz link do resetowania hasła"
}
```

**Note:** Same response for existing and non-existing emails (security)

**Rate Limit:** 3 requests per hour per IP

---

### 🔐 POST `/reset-password` - Reset Password with Token

**Request Body:**
```json
{
  "token": "abc123def456...",
  "newPassword": "NewSecurePassword456$"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Hasło zostało pomyślnie zresetowane"
}
```

**Security Actions:**
- Validates reset token (1 hour expiry)
- Validates new password strength
- Clears reset token
- Revokes all active sessions
- Resets login attempts counter

---

## 📱 Session Management

### 📱 GET `/sessions` - Get User Sessions

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "session_id_1",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
      "device": "Desktop",
      "location": "Warsaw, Poland",
      "createdAt": "2025-09-03T09:00:00.000Z",
      "lastUsedAt": "2025-09-03T10:30:00.000Z"
    },
    {
      "id": "session_id_2",
      "ipAddress": "192.168.1.101",
      "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0...)...",
      "device": "Mobile",
      "location": "Warsaw, Poland",
      "createdAt": "2025-09-02T14:00:00.000Z",
      "lastUsedAt": "2025-09-02T18:45:00.000Z"
    }
  ]
}
```

---

### 📱 DELETE `/sessions/:sessionId` - Revoke Session

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sesja została unieważniona"
}
```

---

## 🛡️ Middleware Usage

### Authentication Middleware

```javascript
import { authenticate } from './auth/middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Protect routes
app.use('/api/protected', authenticate(prisma));
```

### Authorization Middleware

```javascript
import { authorize, requireRole } from './auth/middleware/authMiddleware';

// Require specific permissions
app.get('/api/admin/users', 
  authenticate(prisma),
  authorize('USER_MANAGEMENT'),
  getUsersController
);

// Require specific roles
app.delete('/api/studies/:id',
  authenticate(prisma),
  requireRole('ADMIN', 'MANAGER'),
  deleteStudyController
);
```

### Optional Authentication

```javascript
import { optionalAuth } from './auth/middleware/authMiddleware';

// Optional auth - doesn't fail if no token
app.get('/api/public/protocols',
  optionalAuth(prisma),
  getPublicProtocolsController
);
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# JWT Configuration (REQUIRED)
JWT_ACCESS_SECRET="your-super-secret-access-token-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-here"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"
JWT_ISSUER="edith-research-platform"
JWT_AUDIENCE="edith-users"

# Security Configuration
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=15
SESSION_TIMEOUT_MINUTES=1440

# Rate Limiting
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX_ATTEMPTS=5
REGISTRATION_RATE_LIMIT_WINDOW_MS=3600000
REGISTRATION_RATE_LIMIT_MAX_ATTEMPTS=3
```

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 number
- At least 1 special character
- No common patterns (password, 123456, qwerty, etc.)
- No more than 2 consecutive identical characters

---

## 🔒 Security Best Practices

### Token Management

1. **Access Tokens:**
   - Short lifespan (15 minutes)
   - Include in Authorization header as Bearer token
   - Store in memory, not localStorage

2. **Refresh Tokens:**
   - Longer lifespan (7 days)
   - Stored as httpOnly cookies
   - Automatically rotated on refresh

3. **Token Blacklisting:**
   - Tokens are blacklisted on logout
   - Expired tokens automatically cleaned up

### Session Security

1. **Session Tracking:**
   - IP address monitoring
   - User agent tracking
   - Device fingerprinting
   - Location detection

2. **Session Limits:**
   - Maximum 5 active sessions per user
   - Automatic session cleanup
   - Manual session revocation

### Account Protection

1. **Brute Force Protection:**
   - Rate limiting on auth endpoints
   - Account lockout after failed attempts
   - Progressive delay increases

2. **Password Security:**
   - Strong password requirements
   - bcrypt hashing with 12 rounds
   - Password history prevention

---

## 🚨 Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": "Human readable error message",
  "code": "ERROR_CODE",
  "field": "fieldName",
  "errors": [
    {
      "msg": "Detailed error message",
      "param": "fieldName",
      "location": "body"
    }
  ]
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `AUTH_ERROR` | General authentication error | 401 |
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `PERMISSION_DENIED` | Insufficient permissions | 403 |
| `ACCOUNT_LOCKED` | Account temporarily locked | 401 |
| `TOKEN_EXPIRED` | Access token expired | 401 |
| `TOKEN_INVALID` | Invalid or malformed token | 401 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |

---

## 🧪 Testing

### Test Users (Development Only)

```javascript
// Available after running seed
const testUsers = [
  {
    email: 'admin@edith.pl',
    password: 'Admin123!@#',
    role: 'SUPER_ADMIN'
  },
  {
    email: 'researcher@edith.pl', 
    password: 'Research123!',
    role: 'RESEARCHER'
  },
  {
    email: 'operator@edith.pl',
    password: 'Operator123!',
    role: 'OPERATOR'
  }
];
```

### Example Test Flow

```javascript
// 1. Login as admin
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@edith.pl',
    password: 'Admin123!@#'
  })
});

const { data: { tokens } } = await loginResponse.json();

// 2. Access protected resource
const protectedResponse = await fetch('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${tokens.accessToken}`
  }
});

// 3. Test authorization
const adminResponse = await fetch('/api/admin/users', {
  headers: {
    'Authorization': `Bearer ${tokens.accessToken}`
  }
});
```

---

## 📞 Support

### Common Issues

1. **"Token expired" errors:**
   - Implement automatic token refresh
   - Handle 401 responses in frontend

2. **CORS issues:**
   - Ensure credentials: true in requests
   - Verify FRONTEND_URL in backend .env

3. **Password validation errors:**
   - Check password requirements
   - Validate against common patterns

4. **Rate limiting:**
   - Implement retry logic with exponential backoff
   - Check rate limit headers in response

### Debug Information

```javascript
// Enable debug logging
console.log('JWT Config:', {
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY,
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE
});
```

---

## 📋 Changelog

### Version 1.0.0 (2025-09-03)
- ✅ Initial authentication system
- ✅ JWT token management
- ✅ Role-based access control
- ✅ Session management
- ✅ Password security
- ✅ Rate limiting
- ✅ User registration/login
- ✅ Profile management
- ✅ Database seeding with test users

---

**🎯 Ready to integrate with frontend!** All authentication endpoints are fully functional and tested.
