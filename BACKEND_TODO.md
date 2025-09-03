# 🎯 BACKEND TODO - EDITH Research Platform

## 📋 **OVERVIEW**
Budujemy pełny backend dla platformy badawczej EDITH, która obsługuje protokoły badawcze, studia, sesje pomiarowe i analizę wyników. Musimy zastąpić wszystkie mocki z frontendu działającym API.

---

## 🔴 **PHASE 1: FOUNDATION & CORE SETUP**

### 1.1 Database & ORM Setup ✅ (Częściowo)
- [x] Prisma schema już istnieje
- [ ] **Weryfikacja modeli Prisma** - sprawdzenie czy wszystkie typy z frontendu są pokryte
- [ ] **Migracje** - utworzenie wszystkich tabel
- [ ] **Seed data** - dodanie przykładowych danych do testowania
- [ ] **Connection pooling** - optymalizacja połączeń z bazą

### 1.2 Authentication & Security
- [ ] **JWT Authentication** - implementacja systemu logowania
- [ ] **Password hashing** - bcrypt dla haseł
- [ ] **Middleware autoryzacji** - ochrona endpointów
- [ ] **RBAC (Role-Based Access Control)** - role USER, ADMIN, RESEARCHER
- [ ] **Rate limiting** - ochrona przed atakami
- [ ] **CORS configuration** - bezpieczne połączenia z frontendem

### 1.3 Core Infrastructure
- [ ] **Error handling middleware** - centralna obsługa błędów
- [ ] **Request validation** - Joi/Zod dla walidacji
- [ ] **Logging system** - Winston/Pino dla logów
- [ ] **Environment configuration** - różne środowiska (dev/prod)
- [ ] **Health checks** - monitoring stanu aplikacji

---

## 🟡 **PHASE 2: CORE API ENDPOINTS**

### 2.1 Auth API (`/api/auth`)
- [ ] `POST /register` - rejestracja nowych użytkowników
- [ ] `POST /login` - logowanie użytkowników
- [ ] `POST /logout` - wylogowanie
- [ ] `POST /refresh` - odświeżanie tokenów
- [ ] `POST /forgot-password` - resetowanie hasła
- [ ] `POST /reset-password` - ustawianie nowego hasła
- [ ] `GET /profile` - profil użytkownika
- [ ] `PUT /profile` - aktualizacja profilu

### 2.2 Users API (`/api/users`)
- [ ] `GET /users` - lista użytkowników (admin)
- [ ] `GET /users/:id` - szczegóły użytkownika
- [ ] `PUT /users/:id` - aktualizacja użytkownika
- [ ] `DELETE /users/:id` - usunięcie użytkownika
- [ ] `PUT /users/:id/role` - zmiana roli
- [ ] `PUT /users/:id/status` - aktywacja/deaktywacja

### 2.3 Protocols API (`/api/protocols`) ⚠️ **PRIORYTET**
**Frontend już wysyła requesty do tych endpointów!**

- [ ] `GET /protocols` - lista wszystkich protokołów
- [ ] `GET /protocols/:id` - szczegóły protokołu
- [ ] `POST /protocols` - tworzenie nowego protokołu ⭐ **PILNE**
- [ ] `PUT /protocols/:id` - aktualizacja protokołu ⭐ **PILNE**
- [ ] `DELETE /protocols/:id` - usunięcie protokołu ⭐ **PILNE**
- [ ] `GET /protocols/search` - wyszukiwanie protokołów
- [ ] `GET /protocols/categories` - kategorie protokołów
- [ ] `POST /protocols/:id/clone` - klonowanie protokołu

### 2.4 Predefined Protocols API (`/api/predefined-protocols`) ⚠️ **PRIORYTET**
**Frontend już wysyła requesty!**

- [ ] `GET /predefined-protocols` - lista predefiniowanych protokołów ⭐ **PILNE**
- [ ] `GET /predefined-protocols/:id` - szczegóły protokołu
- [ ] `GET /predefined-protocols/category/:category` - protokoły wg kategorii
- [ ] `POST /predefined-protocols/:id/use` - użycie protokołu jako template

### 2.5 Studies API (`/api/studies`) ⚠️ **NAJWYŻSZY PRIORYTET**
**Frontend aktywnie używa tych endpointów!**

- [ ] `GET /studies` - lista wszystkich studiów ⭐ **KRYTYCZNE**
- [ ] `GET /studies/:id` - szczegóły studium ⭐ **KRYTYCZNE**
- [ ] `POST /studies` - tworzenie nowego studium ⭐ **KRYTYCZNE**
- [ ] `PUT /studies/:id` - aktualizacja studium ⭐ **KRYTYCZNE**
- [ ] `PATCH /studies/:id/status` - zmiana statusu studium ⭐ **KRYTYCZNE**
- [ ] `DELETE /studies/:id` - usunięcie studium ⭐ **KRYTYCZNE**
- [ ] `GET /studies/:id/statistics` - statystyki studium
- [ ] `POST /studies/:id/clone` - klonowanie studium

---

## 🟢 **PHASE 3: ADVANCED FEATURES**

### 3.1 Study Sessions API (`/api/studies/:studyId/sessions`)
- [ ] `GET /studies/:studyId/sessions` - sesje dla studium
- [ ] `GET /sessions/:sessionId` - szczegóły sesji
- [ ] `POST /studies/:studyId/sessions` - nowa sesja pomiarowa
- [ ] `PUT /sessions/:sessionId` - aktualizacja sesji
- [ ] `DELETE /sessions/:sessionId` - usunięcie sesji
- [ ] `PATCH /sessions/:sessionId/complete` - zakończenie sesji
- [ ] `POST /sessions/:sessionId/data` - dodanie danych pomiarowych

### 3.2 Study Results API (`/api/studies/:studyId/results`)
- [ ] `GET /studies/:studyId/results` - wyniki studium
- [ ] `GET /results/:resultId` - szczegóły wyniku
- [ ] `POST /studies/:studyId/calculate` - kalkulacja wyników
- [ ] `GET /results/:resultId/export` - export wyników (CSV/PDF)
- [ ] `POST /results/:resultId/validate` - walidacja wyników

### 3.3 Data Collection API
- [ ] `POST /data-points` - dodanie punktu danych
- [ ] `PUT /data-points/:id` - aktualizacja punktu danych
- [ ] `DELETE /data-points/:id` - usunięcie punktu danych
- [ ] `POST /data-validation` - walidacja danych pomiarowych
- [ ] `GET /data/:studyId/summary` - podsumowanie danych

### 3.4 File Management API
- [ ] `POST /files/upload` - upload plików
- [ ] `GET /files/:id` - pobieranie pliku
- [ ] `DELETE /files/:id` - usunięcie pliku
- [ ] `POST /files/:id/process` - przetwarzanie plików danych
- [ ] `GET /files/:studyId/exports` - lista eksportów

---

## 🔵 **PHASE 4: INTEGRATION & OPTIMIZATION**

### 4.1 Real-time Features
- [ ] **WebSocket setup** - komunikacja real-time
- [ ] **Study session updates** - live updates podczas sesji
- [ ] **Notifications** - powiadomienia o zmianach
- [ ] **Progress tracking** - śledzenie postępu w czasie rzeczywistym

### 4.2 Data Processing & Analytics
- [ ] **Statistical calculations** - obliczenia statystyczne
- [ ] **Data aggregation** - agregacja danych z wielu sesji
- [ ] **Trend analysis** - analiza trendów
- [ ] **Quality control** - kontrola jakości danych
- [ ] **Automated reporting** - automatyczne raporty

### 4.3 Integration Services
- [ ] **Equipment integration** - integracja z urządzeniami pomiarowymi
- [ ] **LIMS integration** - integracja z systemami laboratoryjnymi
- [ ] **Email service** - wysyłanie powiadomień
- [ ] **Backup service** - tworzenie kopii zapasowych
- [ ] **Audit trail** - śledzenie zmian

---

## 🟣 **PHASE 5: ADVANCED FEATURES & SCALING**

### 5.1 Advanced Analytics
- [ ] **Machine Learning endpoints** - ML dla analizy danych
- [ ] **Prediction models** - modele predykcyjne
- [ ] **Anomaly detection** - wykrywanie anomalii
- [ ] **Pattern recognition** - rozpoznawanie wzorców

### 5.2 Multi-tenancy & Scaling
- [ ] **Multi-tenant support** - obsługa wielu organizacji
- [ ] **Data isolation** - izolacja danych między tenantami
- [ ] **Resource limiting** - ograniczenia zasobów
- [ ] **Horizontal scaling** - skalowanie horyzontalne

### 5.3 Advanced Security
- [ ] **Audit logging** - szczegółowe logi audytu
- [ ] **Data encryption** - szyfrowanie wrażliwych danych
- [ ] **API versioning** - wersjonowanie API
- [ ] **Security scanning** - skanowanie bezpieczeństwa

---

## 📊 **IMMEDIATE ACTION PLAN (Next 2-3 days)**

### ⭐ **DAY 1: Critical Endpoints**
1. **Napraw/Utwórz Studies API** - `GET /studies` i `POST /studies`
2. **Napraw/Utwórz Protocols API** - podstawowe CRUD operacje
3. **Napraw Predefined Protocols API** - `GET /predefined-protocols`
4. **Test wszystkich endpointów** z frontendem

### ⭐ **DAY 2: Core Functionality**
1. **Dokończ Studies API** - wszystkie operacje
2. **Implementuj Study Sessions** - podstawowe operacje
3. **Dodaj walidację danych** - Joi/Zod schemas
4. **Error handling** - centralna obsługa błędów

### ⭐ **DAY 3: Integration & Testing**
1. **Połącz frontend z backendem** - usuń wszystkie mocki
2. **Testy integracyjne** - testowanie pełnych flow'ów
3. **Optymalizacja** - performance tuning
4. **Dokumentacja API** - Swagger/OpenAPI

---

## 🔧 **TECHNICAL SPECIFICATIONS**

### Database Models Priority:
1. **User** ✅ (exists)
2. **Protocol** ✅ (exists) 
3. **Study** ✅ (exists)
4. **StudySession** ✅ (exists)
5. **StudyResult** ✅ (exists)
6. **DataPoint** ⚠️ (verify)
7. **AuditLog** ⚠️ (verify)

### API Response Format:
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Authentication Flow:
```
1. Login → JWT Token
2. All requests → Bearer Token
3. Token refresh → New JWT
4. Role-based permissions
```

---

## 🚨 **CRITICAL FRONTEND INTEGRATION POINTS**

### Frontend już używa tych endpointów:
- `GET /api/studies` ← **KRYTYCZNE**
- `POST /api/studies` ← **KRYTYCZNE**
- `GET /api/protocols` ← **WYSOKIE**
- `POST /api/protocols` ← **WYSOKIE**
- `GET /api/predefined-protocols` ← **WYSOKIE**

**Kolejność implementacji powinna priorytetyzować powyższe endpointy!**

---

## 📈 **SUCCESS METRICS**

- [ ] Wszystkie endpointy z frontendu działają
- [ ] Brak mocków w aplikacji frontendowej
- [ ] Pełna funkcjonalność CRUD dla wszystkich głównych encji
- [ ] Czas odpowiedzi API < 200ms
- [ ] 100% pokrycie testami krytycznych endpointów
- [ ] Zero błędów 500 w production

---

**Status: READY TO START** 🚀
**Estimated Timeline: 5-7 days for full implementation**
**Critical Path: Studies API → Protocols API → Sessions API**
