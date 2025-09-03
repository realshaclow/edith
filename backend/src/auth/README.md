# 🔐 EDITH Authentication Module

Professional authentication system for the EDITH Research Platform with JWT tokens, role-based access control, and advanced security features.

## 📁 Module Structure

```
src/auth/
├── controllers/
│   └── authController.ts      # Authentication endpoints
├── middleware/
│   └── authMiddleware.ts      # Auth & authorization middleware
├── services/
│   └── authService.ts         # Business logic layer
├── utils/
│   ├── config.ts              # Security configuration
│   ├── jwt.ts                 # JWT token utilities
│   └── password.ts            # Password hashing & validation
├── validators/
│   └── authValidators.ts      # Input validation schemas
├── types/
│   └── index.ts               # TypeScript interfaces
├── routes/
│   └── authRoutes.ts          # Route definitions
└── index.ts                   # Module exports
```

## 🚀 Quick Start

### 1. Installation
Already included in the backend - no additional setup needed!

### 2. Test the API
```bash
# Start the backend
npm run dev

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@edith.pl","password":"Admin123!@#"}'
```

### 3. Test Users (Created by Seed)
- **Admin**: `admin@edith.pl` / `Admin123!@#`
- **Researcher**: `researcher@edith.pl` / `Research123!`
- **Operator**: `operator@edith.pl` / `Operator123!`

## 🛡️ Features

### ✅ Implemented
- **JWT Authentication** - Access & refresh tokens
- **Role-Based Access Control** - 7 user roles with granular permissions
- **Password Security** - bcrypt hashing, strength validation
- **Session Management** - Track and manage user sessions
- **Rate Limiting** - Protection against brute force attacks
- **Account Security** - Lockout after failed attempts
- **Token Refresh** - Automatic token renewal
- **Input Validation** - Comprehensive request validation
- **Security Middleware** - Easy integration with routes

### 🔐 Security Features
- bcrypt with 12 rounds for password hashing
- JWT with separate access/refresh tokens
- Account lockout (5 attempts = 15min lock)
- Rate limiting on auth endpoints
- Session tracking with IP/UserAgent
- Token blacklisting on logout
- CORS protection
- Helmet security headers

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/logout` | User logout | ✅ |
| GET | `/api/auth/profile` | Get user profile | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |
| POST | `/api/auth/change-password` | Change password | ✅ |
| POST | `/api/auth/refresh-token` | Refresh access token | ❌ |
| POST | `/api/auth/forgot-password` | Request password reset | ❌ |
| POST | `/api/auth/reset-password` | Reset password with token | ❌ |
| GET | `/api/auth/sessions` | Get user sessions | ✅ |
| DELETE | `/api/auth/sessions/:id` | Revoke session | ✅ |

## 👥 User Roles & Permissions

### Roles (Hierarchical)
1. **SUPER_ADMIN** - Full system access
2. **ADMIN** - User management + all resources
3. **MANAGER** - Project & protocol management
4. **RESEARCHER** - Create & execute studies
5. **OPERATOR** - Execute studies & input data
6. **USER** - Basic read access
7. **GUEST** - Limited read access

### Permission System
- `SYSTEM_ADMIN` - System administration
- `USER_MANAGEMENT` - Manage users
- `PROTOCOL_*` - Protocol operations (CREATE, READ, UPDATE, DELETE)
- `STUDY_*` - Study operations (CREATE, READ, UPDATE, DELETE, EXECUTE)
- `DATA_*` - Data operations (READ, WRITE, DELETE)
- `REPORT_*` - Report operations (VIEW, EXPORT)
- `AUDIT_VIEW` - View audit logs

## 🛠️ Usage Examples

### Basic Authentication
```typescript
import { authenticate, authorize } from './auth';

// Protect route with authentication
app.get('/api/protected', authenticate(prisma), (req, res) => {
  res.json({ user: req.user });
});

// Require specific permission
app.post('/api/protocols', 
  authenticate(prisma),
  authorize('PROTOCOL_CREATE'),
  createProtocolController
);

// Require specific role
app.get('/api/admin/users',
  authenticate(prisma),
  requireRole('ADMIN', 'SUPER_ADMIN'),
  getUsersController
);
```

### Check Permissions in Controllers
```typescript
export const someController = (req: Request, res: Response) => {
  const { user, permissions } = req;
  
  if (!permissions.includes('SOME_PERMISSION')) {
    return res.status(403).json({
      success: false,
      error: 'Insufficient permissions'
    });
  }
  
  // Continue with logic...
};
```

## ⚙️ Configuration

### Environment Variables
```bash
# Required for production
JWT_ACCESS_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# Optional (have defaults)
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=15
```

### Security Configuration
```typescript
// Modify auth/utils/config.ts
export const securityConfig = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15
  },
  // ... other settings
};
```

## 🧪 Testing

### Test Database
```bash
# Run seed to create test users
npm run db:seed
```

### Manual Testing
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@edith.pl","password":"Admin123!@#"}'

# Get profile (use token from login response)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Frontend Integration
See `docs/FRONTEND_INTEGRATION.md` for complete React integration guide.

## 🔧 Customization

### Adding New Permissions
1. Add to `PermissionType` enum in Prisma schema
2. Update `rolePermissions` in `auth/utils/config.ts`
3. Run `npm run db:generate`

### Adding Custom Validation
```typescript
// auth/validators/authValidators.ts
export const customValidation = [
  body('customField')
    .isLength({ min: 1 })
    .withMessage('Custom field is required'),
  handleValidationErrors
];
```

### Custom Rate Limiting
```typescript
import { authRateLimit } from './auth/middleware/authMiddleware';

// Custom rate limit
const customLimit = authRateLimit(60000, 10); // 10 requests per minute
app.use('/api/sensitive', customLimit);
```

## 📚 Documentation

- **[Complete API Docs](./AUTH_API.md)** - Full endpoint documentation
- **[Frontend Guide](./FRONTEND_INTEGRATION.md)** - React integration
- **[Security Guide](./SECURITY.md)** - Security best practices

## 🔄 Migration & Updates

### Database Migrations
```bash
# Apply schema changes
npm run db:generate
npm run db:push

# Run new seed data
npm run db:seed
```

### Version Updates
- Follow semantic versioning
- Update CHANGELOG.md
- Test all endpoints after updates
- Update documentation

## 🚨 Security Considerations

### Production Checklist
- [ ] Set strong JWT secrets
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set up monitoring
- [ ] Enable audit logging
- [ ] Review rate limits
- [ ] Update default passwords

### Monitoring
- Monitor failed login attempts
- Track unusual session patterns
- Log all authentication events
- Set up alerts for security events

## 🤝 Contributing

### Code Style
- TypeScript strict mode
- ESLint configuration
- Comprehensive error handling
- JSDoc comments for public APIs

### Adding Features
1. Create feature branch
2. Add TypeScript interfaces
3. Implement with tests
4. Update documentation
5. Submit PR

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for the EDITH Research Platform**

*Secure, scalable, and production-ready authentication.*
