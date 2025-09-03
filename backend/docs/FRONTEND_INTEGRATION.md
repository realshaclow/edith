# 🔗 Frontend Integration Guide - EDITH Auth

## 🚀 Quick Integration

### 1. Install Dependencies

```bash
# If using axios
npm install axios

# If using fetch (built-in), no installation needed
```

### 2. Create Auth Service

```javascript
// src/services/authService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AuthService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/auth`;
  }

  // Login
  async login(email, password, rememberMe = false) {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ email, password, rememberMe })
    });

    const result = await response.json();
    
    if (result.success) {
      // Store access token
      localStorage.setItem('accessToken', result.data.tokens.accessToken);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      return result.data;
    } else {
      throw new Error(result.error);
    }
  }

  // Logout
  async logout() {
    const token = localStorage.getItem('accessToken');
    
    try {
      await fetch(`${this.baseURL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get access token
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getAccessToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Check if user has permission
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Role-based permissions (simplified)
    const rolePermissions = {
      'SUPER_ADMIN': ['*'], // All permissions
      'ADMIN': ['USER_MANAGEMENT', 'PROTOCOL_CREATE', 'PROTOCOL_READ', 'PROTOCOL_UPDATE', 'PROTOCOL_DELETE', 'STUDY_CREATE', 'STUDY_READ', 'STUDY_UPDATE', 'STUDY_DELETE', 'STUDY_EXECUTE', 'DATA_READ', 'DATA_WRITE', 'DATA_DELETE', 'REPORT_VIEW', 'REPORT_EXPORT', 'AUDIT_VIEW'],
      'MANAGER': ['PROTOCOL_CREATE', 'PROTOCOL_READ', 'PROTOCOL_UPDATE', 'STUDY_CREATE', 'STUDY_READ', 'STUDY_UPDATE', 'STUDY_EXECUTE', 'DATA_READ', 'DATA_WRITE', 'REPORT_VIEW', 'REPORT_EXPORT'],
      'RESEARCHER': ['PROTOCOL_READ', 'STUDY_CREATE', 'STUDY_READ', 'STUDY_UPDATE', 'STUDY_EXECUTE', 'DATA_READ', 'DATA_WRITE', 'REPORT_VIEW', 'REPORT_EXPORT'],
      'OPERATOR': ['PROTOCOL_READ', 'STUDY_READ', 'STUDY_EXECUTE', 'DATA_READ', 'DATA_WRITE', 'REPORT_VIEW'],
      'USER': ['PROTOCOL_READ', 'STUDY_READ', 'DATA_READ', 'REPORT_VIEW'],
      'GUEST': ['PROTOCOL_READ', 'STUDY_READ', 'DATA_READ']
    };

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await fetch(`${this.baseURL}/refresh-token`, {
        method: 'POST',
        credentials: 'include' // Send httpOnly cookie
      });

      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('accessToken', result.data.accessToken);
        return result.data.accessToken;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      // If refresh fails, logout user
      this.logout();
      throw error;
    }
  }
}

export default new AuthService();
```

### 3. Create API Interceptor

```javascript
// src/services/apiClient.js
import authService from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    let token = authService.getAccessToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include',
      ...options
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      let response = await fetch(url, config);
      
      // If token expired, try to refresh
      if (response.status === 401 && token) {
        try {
          token = await authService.refreshToken();
          config.headers.Authorization = `Bearer ${token}`;
          response = await fetch(url, config);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          window.location.href = '/login';
          throw refreshError;
        }
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

export default new ApiClient();
```

### 4. React Hook for Authentication

```javascript
// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password, rememberMe);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const hasPermission = (permission) => {
    return authService.hasPermission(permission);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 5. Protected Route Component

```javascript
// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, hasPermission, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <div>Access Denied</div>;
  }

  return children;
};

export default ProtectedRoute;
```

### 6. Login Component Example

```javascript
// src/components/LoginForm.js
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="admin@edith.pl"
        />
      </div>
      
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Admin123!@#"
        />
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
```

### 7. App Setup

```javascript
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredPermission="USER_MANAGEMENT">
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

### 8. Environment Variables

```bash
# .env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎯 Test Credentials

```javascript
// Development test users
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

## ✅ Integration Checklist

- [ ] Install dependencies
- [ ] Create AuthService
- [ ] Create ApiClient with token refresh
- [ ] Implement useAuth hook
- [ ] Create ProtectedRoute component
- [ ] Update App.js with AuthProvider
- [ ] Set environment variables
- [ ] Test login with admin credentials
- [ ] Test protected routes
- [ ] Test permission-based access
- [ ] Test token refresh functionality
- [ ] Test logout functionality

## 🐛 Common Issues & Solutions

### 1. CORS Issues
```javascript
// Backend already configured, but ensure frontend sends credentials
fetch('/api/auth/login', {
  credentials: 'include' // Important!
});
```

### 2. Token Refresh Loop
```javascript
// Add flag to prevent multiple refresh attempts
let isRefreshing = false;

if (response.status === 401 && !isRefreshing) {
  isRefreshing = true;
  // ... refresh logic
  isRefreshing = false;
}
```

### 3. Memory Leaks
```javascript
// Clear intervals/timeouts on component unmount
useEffect(() => {
  return () => {
    // Cleanup
  };
}, []);
```

## 🚀 You're Ready!

Your authentication system is now fully integrated and ready to use! 🎉
