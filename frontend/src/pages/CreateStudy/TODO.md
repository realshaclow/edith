# TODO: CreateStudy - Plan Implementacji

## 🎯 Cel
Stworzenie profesjonalnego systemu tworzenia studium badawczego, który:
- Pobiera dane z wybranego protokołu (API)
- Umożliwia dostosowanie próbek i sesji  
- Nie uż## 📋 Następne Kroki (PRIORYTET)
1. ✅ Stworzenie struktury folderów 
2. ✅ Definicja typów TypeScript z pomiarami per krok
3. ✅ **Implementacja głównego hooka useCreateStudy**
4. ✅ **Krok "Konfiguracja Pomiarów" - najważniejszy!**
5. ✅ **Główny komponent CreateStudy.tsx**
6. 🔥 **NAPRAWIENIE BŁĘDÓW KOMPILACJI** (IN PROGRESS)
   - ✅ Poprawienie eksportów i importów
   - ✅ Naprawienie API call w useCreateStudy
   - ❌ Usunięcie phantom file OperatorAssignmentStep.tsx (webpack cache issue)
   - ❌ Dalsze poprawki typów
7. 🔄 **Implementacja pozostałych kroków po kolei**
   - ⏸️ ProtocolSelectionStep.tsx (częściowo implementowany)
   - ❌ BasicInfoStep.tsx
   - ❌ SampleConfigurationStep.tsx
   - ❌ SessionConfigurationStep.tsx
   - ❌ OperatorEquipmentStep.tsx
   - ❌ ReviewStep.tsx
8. Pełna integracja z API
9. Testing i polish

## 🚨 **Aktualny Status: FIXING WEBPACK CACHE ISSUES**h mocków, tylko prawdziwe API
- Wspiera tryb jasny/ciemny
- Jest spójny z resztą aplikacji (Material-UI)

## 📋 Struktura Folderów
```
src/pages/CreateStudy/
├── components/          # Komponenty kroków
├── hooks/              # Hooki do zarządzania stanem
├── types/              # Typy TypeScript  
├── utils/              # Narzędzia pomocnicze
├── CreateStudy.tsx     # Główny komponent
└── index.ts           # Export
```

## 🚀 Kroki do Zaimplementowania

### 1. **Analiza Backend API** ✅
- [x] Sprawdzenie endpointów protokołów
- [x] Sprawdzenie endpointów studiów
- [x] Analiza struktury danych protokołów
- [x] Identyfikacja dostępnych protokołów predefined

**Dostępne endpointy:**
- `GET /api/protocols` - lista protokołów
- `GET /api/protocols/:id` - szczegóły protokołu  
- `GET /api/protocols/public` - publiczne protokoły
- `POST /api/studies` - tworzenie studium
- `POST /api/studies/:studyId/sessions` - tworzenie sesji

### 2. **Typy i Interfejsy** 📝
- [ ] StudyFormData - dane formularza
- [ ] ProtocolData - dane protokołu z API
- [ ] SessionConfig - konfiguracja sesji
- [ ] SampleConfig - konfiguracja próbek
- [ ] **StepMeasurement** - pomiary przypisane do kroków
- [ ] **MeasurementDefinition** - definicja pomiaru
- [ ] CreateStudyStep - kroki tworzenia

### 3. **Główny Hook useCreateStudy** 🎣
- [ ] Stan formularza (StudyFormData)
- [ ] Pobieranie protokołów z API (bez mocków!)
- [ ] Nawigacja między krokami
- [ ] Walidacja danych
- [ ] Tworzenie studium przez API
- [ ] Obsługa błędów

### 4. **Komponenty Kroków** 🔧

#### Krok 1: Wybór Protokołu
- [ ] **ProtocolSelectionStep.tsx**
  - [ ] Pobieranie listy protokołów z API (`/api/protocols/public`)
  - [ ] Filtrowanie po kategorii (mechanical, chemical, physical, thermal, electrical)
  - [ ] Wyszukiwanie
  - [ ] Podgląd szczegółów protokołu
  - [ ] Wybór protokołu i przejście do następnego kroku

#### Krok 2: Podstawowe Informacje
- [ ] **BasicInfoStep.tsx**  
  - [ ] Nazwa studium (walidacja)
  - [ ] Opis studium
  - [ ] Wyświetlenie wybranego protokołu (read-only)
  - [ ] Kategoria (z protokołu)

#### Krok 3: Konfiguracja Próbek  
- [ ] **SampleConfigurationStep.tsx**
  - [ ] Liczba próbek (min: 1, max: 1000)
  - [ ] Prefiks nazw próbek (np. "S", "SAMPLE")
  - [ ] Typ numeracji (automatyczna/manualna) 
  - [ ] Podgląd nazw próbek
  - [ ] Właściwości próbek (wymiary, materiał) - z protokołu

#### Krok 4: Warunki Testowe
- [ ] **TestConditionsStep.tsx**
  - [ ] Pobranie warunków z wybranego protokołu 
  - [ ] Edycja wartości warunków (temperatura, wilgotność, prędkość, itp.)
  - [ ] Walidacja zakresów tolerancji
  - [ ] Oznaczenie wymaganych warunków

#### Krok 5: Konfiguracja Sesji
- [ ] **SessionConfigurationStep.tsx**
  - [ ] Typ sesji (jedna sesja / wiele sesji)
  - [ ] Maksymalna liczba próbek na sesję
  - [ ] Harmonogram sesji (opcjonalnie)
  - [ ] Timeout sesji
  - [ ] Podział próbek między sesje (automatyczny/manualny)

#### Krok 6: Konfiguracja Pomiarów dla Kroków
- [ ] **StepMeasurementsStep.tsx**
  - [ ] **Lista kroków z protokołu** - wyświetlenie wszystkich kroków
  - [ ] **Dla każdego kroku możliwość dodania pomiarów**:
    - [ ] Typ pomiaru (MEASUREMENT, OBSERVATION, CALCULATION, CONDITION)
    - [ ] Nazwa pomiaru (np. "Siła maksymalna", "Temperatura", "Uwagi wizualne")
    - [ ] Typ danych (NUMBER, TEXT, BOOLEAN, DATE)
    - [ ] Jednostka (MPa, °C, mm, %)
    - [ ] Czy wymagany
    - [ ] Zakres wartości (min/max)
    - [ ] Domyślna wartość
    - [ ] Formuła obliczeniowa (dla typu CALCULATION)
  - [ ] **Predefined pomiary z protokołu** - automatyczne sugerowanie typowych pomiarów
  - [ ] **Podgląd struktury danych** - jak będą wyglądać sesje pomiarowe
  - [ ] **Import/Export konfiguracji** pomiarów

#### Krok 7: Operator i Sprzęt  
- [ ] **OperatorEquipmentStep.tsx**
  - [ ] Przypisanie operatora (nazwa, email)
  - [ ] Lista sprzętu (z protokołu)
  - [ ] Weryfikacja dostępności sprzętu
  - [ ] Uwagi dotyczące bezpieczeństwa (z protokołu)

#### Krok 8: Przegląd i Tworzenie
- [ ] **ReviewStep.tsx**
  - [ ] Podsumowanie wszystkich ustawień
  - [ ] Estymowany czas trwania
  - [ ] Podgląd struktury sesji i próbek
  - [ ] Przycisk "Utwórz Studium"

### 5. **Główny Komponent CreateStudy** 🏗️
- [ ] **CreateStudy.tsx**
  - [ ] Material-UI Stepper z krokami
  - [ ] Tryb jasny/ciemny
  - [ ] Progress bar
  - [ ] Nawigacja między krokami  
  - [ ] Obsługa błędów
  - [ ] Loading states
  - [ ] Responsive design

### 6. **API Integration** 🌐
- [ ] **Hooki API**
  - [ ] `useProtocols()` - pobieranie protokołów
  - [ ] `useProtocolDetails(id)` - szczegóły protokołu
  - [ ] `useCreateStudy()` - tworzenie studium
  - [ ] Obsługa błędów API
  - [ ] Loading states
  - [ ] Cache dla protokołów

### 7. **Walidacja i Error Handling** ✅
- [ ] Walidacja na poziomie kroków
- [ ] Walidacja całego formularza
- [ ] Friendly error messages
- [ ] Rollback przy błędach API
- [ ] Komunikaty sukcesu

### 8. **UX/UI Enhancements** 🎨
- [ ] Smooth transitions między krokami
- [ ] Tooltips z informacjami o parametrach
- [ ] Auto-save draft (localStorage)
- [ ] Breadcrumbs navigation
- [ ] Keyboard shortcuts
- [ ] Loading skeletons

### 9. **Testing & Polish** 🧪
- [ ] Testowanie z różnymi protokołami
- [ ] Walidacja danych end-to-end
- [ ] Performance optimization
- [ ] Code review i refactoring

## 🔑 Kluczowa Koncepcja: Pomiary per Krok

### 💡 **Główna Idea**
Każdy krok protokołu (np. "Test Rozciągania", "Analiza Danych") może mieć przypisane **konkretne pomiary** które będą zbierane podczas wykonywania tego kroku w sesji badawczej.

**Przykład dla kroku "Test Rozciągania" z ASTM D638:**
- 📊 Siła maksymalna (NUMBER, MPa, wymagane)
- 📊 Przemieszczenie przy zerwaniu (NUMBER, mm, wymagane) 
- 📊 Czas trwania testu (NUMBER, sekundy, opcjonalne)
- 📝 Uwagi wizualne (TEXT, opcjonalne)
- ✅ Czy zniszczenie w części pomiarowej (BOOLEAN, wymagane)
- 🧮 Naprężenie (CALCULATION, MPa, formuła: Siła/Powierzchnia)

### 🎯 **Korzyści**
- **Strukturalne dane** - każda sesja wie dokładnie jakie dane zbierać
- **Flexibilność** - różne protokoły = różne pomiary  
- **Automatyzacja** - sesje mogą automatycznie generować formularze
- **Walidacja** - kontrola typów danych i zakresów
- **Spójność** - wszystkie sesje tego samego studium zbierają te same dane

### 📋 **Typy Pomiarów (z Backend)**
```typescript
enum DataPointType {
  MEASUREMENT = 'MEASUREMENT',    // Pomiary bezpośrednie (siła, temperatura)
  OBSERVATION = 'OBSERVATION',    // Obserwacje (uwagi, zdjęcia)  
  CALCULATION = 'CALCULATION',    // Obliczenia (naprężenie, moduł)
  CONDITION = 'CONDITION'         // Warunki (temperatura otoczenia)
}

enum DataType {
  NUMBER = 'NUMBER',       // Wartości numeryczne
  TEXT = 'TEXT',          // Tekst, uwagi
  BOOLEAN = 'BOOLEAN',    // Tak/Nie, checkboxy
  DATE = 'DATE'           // Data/czas
}
```

## � Kluczowe Wymagania
- Wszystkie dane protokołów z `/api/protocols`
- Wszystkie operacje przez prawdziwe endpointy
- Obsługa stanów loading/error z API

### 🎨 **Spójność z Aplikacją**
- Material-UI komponenty
- Wspieranie trybu jasnego/ciemnego  
- Spójne ikony i typografia
- Responsive design

### 📊 **Integracja z Protokołami**  
- Automatyczne pobieranie parametrów z protokołu
- Warunki testowe z protokołu jako domyślne
- Kroki protokołu jako podstawa konfiguracji
- Sprzęt i materiały z protokołu

### 🔄 **Zarządzanie Sesjami**
- Elastyczna konfiguracja sesji
- Podział próbek między sesje
- Planowanie harmonogramu
- Obsługa wielu operatorów

## 📋 Następne Kroki (PRIORYTET)
1. ✅ Stworzenie struktury folderów 
2. ✅ Definicja typów TypeScript z pomiarami per krok
3. ✅ **Implementacja głównego hooka useCreateStudy**
4. ✅ **Krok "Konfiguracja Pomiarów" - najważniejszy!**
5. ✅ **Główny komponent CreateStudy.tsx**
6. 🔥 **Sprawdzenie kompilacji i podstawowy test**
7. � **Implementacja pozostałych kroków po kolei**
8. Pełna integracja z API
9. Testing i polish

---
**Status**: 📋 Planning Phase  
**Priorytet**: 🔥 High  
**Estymowany czas**: 2-3 dni robocze
