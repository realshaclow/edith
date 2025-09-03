# OAuth Setup Guide

## Konfiguracja OAuth Providers

### 1. Google OAuth
1. Idź do: https://console.cloud.google.com/
2. Utwórz nowy projekt lub wybierz istniejący
3. Włącz Google+ API w Library
4. Utwórz OAuth 2.0 Client ID w Credentials
5. Ustaw redirect URI: `http://localhost:5000/api/auth/oauth/google/callback`
6. Skopiuj dane do .env:

```env
GOOGLE_CLIENT_ID=twój-google-client-id
GOOGLE_CLIENT_SECRET=twój-google-client-secret
```

### 2. GitHub OAuth
1. Idź do: https://github.com/settings/developers
2. OAuth Apps → New OAuth App
3. Ustaw callback URL: `http://localhost:5000/api/auth/oauth/github/callback`
4. Skopiuj dane do .env:

```env
GITHUB_CLIENT_ID=twój-github-client-id
GITHUB_CLIENT_SECRET=twój-github-client-secret
```

### 3. Microsoft OAuth
1. Idź do: https://portal.azure.com/
2. Azure Active Directory → App registrations → New registration
3. Ustaw redirect URI: `http://localhost:5000/api/auth/oauth/microsoft/callback`
4. Skopiuj dane do .env:

```env
MICROSOFT_CLIENT_ID=twój-microsoft-client-id
MICROSOFT_CLIENT_SECRET=twój-microsoft-client-secret
```

## Testowanie OAuth

Po skonfigurowaniu wszystkich providerów:

1. Restart serwera backend
2. Otwórz frontend na http://localhost:3000/auth
3. Kliknij na przyciski OAuth
4. Sprawdź czy przekierowuje do odpowiednich providerów

## Problemy?

- Sprawdź czy callback URLs są identyczne
- Upewnij się że zmienne środowiskowe są prawidłowe
- Sprawdź logi backendu w konsoli
