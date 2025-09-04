# EDITH Study Execution API Documentation

## Przegląd

Moduł **study-execution** to kompletny system do zarządzania wykonywaniem badań materiałowych w systemie EDITH. Zapewnia pełną funkcjonalność od tworzenia wykonania badania, przez monitorowanie postępu, do eksportu wyników.

## Architektura

```
study-execution/
├── types/           # Definicje TypeScript
├── repositories/    # Warstwa dostępu do danych (Prisma)
├── services/        # Logika biznesowa
├── controllers/     # Kontrolery Express.js
├── middleware/      # Walidacja i autoryzacja
├── routes/          # Definicje tras API
├── utils/           # Narzędzia pomocnicze
└── index.ts         # Główny eksport
```

## API Endpoints

### 1. Zarządzanie wykonaniami badań

#### POST /api/study-executions
Tworzy nowe wykonanie badania.

**Request Body:**
```json
{
  "studyId": "string",
  "studyName": "string",
  "protocolId": "string (optional)",
  "protocolName": "string",
  "category": "string",
  "operatorId": "string",
  "environment": {
    "temperature": 23.5,
    "humidity": 45.2,
    "pressure": 1013.25
  },
  "testConditions": {
    "temperature": 25.0,
    "force": 1000,
    "duration": 3600
  },
  "samples": [
    {
      "name": "Próbka 1",
      "material": "ABS",
      "properties": {
        "thickness": 3.0,
        "width": 10.0
      }
    }
  ],
  "estimatedDuration": "PT2H30M",
  "notes": "Uwagi dodatkowe",
  "tags": ["tag1", "tag2"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "studyId": "string",
    "status": "NOT_STARTED",
    "createdAt": "2024-01-01T12:00:00Z",
    "samples": [...],
    "environment": {...}
  }
}
```

#### GET /api/study-executions/{id}
Pobiera szczegóły wykonania badania.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "studyId": "string",
    "status": "IN_PROGRESS",
    "progress": 45.5,
    "currentStep": 2,
    "samples": [...],
    "measurements": [...],
    "exports": [...]
  }
}
```

#### GET /api/study-executions
Pobiera listę wykonań z filtrami i paginacją.

**Query Parameters:**
- `status` - filtr statusu (możliwość wielokrotnych wartości)
- `operatorId` - ID operatora
- `studyId` - ID badania
- `category` - kategoria badania
- `dateFrom` - data od (ISO 8601)
- `dateTo` - data do (ISO 8601)
- `tags` - tagi (możliwość wielokrotnych wartości)
- `search` - wyszukiwanie tekstowe
- `page` - numer strony (domyślnie 1)
- `limit` - limit wyników (domyślnie 10, max 100)
- `sortBy` - pole sortowania
- `sortOrder` - kierunek sortowania (asc/desc)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "totalPages": 15,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. Zarządzanie cyklem życia

#### POST /api/study-executions/{id}/start
Rozpoczyna wykonanie badania.

#### POST /api/study-executions/{id}/pause
Wstrzymuje wykonanie badania.

**Request Body:**
```json
{
  "notes": "Powód wstrzymania"
}
```

#### POST /api/study-executions/{id}/resume
Wznawia wykonanie badania.

#### POST /api/study-executions/{id}/complete
Kończy wykonanie badania.

**Request Body:**
```json
{
  "summary": "Podsumowanie badania",
  "recommendations": "Rekomendacje"
}
```

### 3. Zarządzanie próbkami

#### POST /api/study-executions/samples/{sampleId}/start
Rozpoczyna próbkę.

#### POST /api/study-executions/samples/{sampleId}/complete
Kończy próbkę.

**Request Body:**
```json
{
  "quality": "pass|fail|warning",
  "notes": "Uwagi do próbki"
}
```

#### POST /api/study-executions/samples/{sampleId}/skip
Pomija próbkę.

**Request Body:**
```json
{
  "reason": "Powód pominięcia próbki"
}
```

### 4. Pomiary

#### POST /api/study-executions/measurements
Dodaje pomiar do próbki.

**Request Body:**
```json
{
  "sampleId": "uuid",
  "stepId": "string",
  "measurementId": "string",
  "value": 123.45,
  "textValue": "optional string value",
  "unit": "MPa",
  "operator": "operator_id",
  "equipment": "equipment_id",
  "method": "method_name",
  "conditions": {
    "temperature": 23.5,
    "humidity": 45.2
  },
  "notes": "Uwagi do pomiaru",
  "rawData": {...}
}
```

### 5. Eksporty

#### POST /api/study-executions/{id}/exports
Tworzy eksport wykonania badania.

**Request Body:**
```json
{
  "format": "PDF|EXCEL|CSV|JSON",
  "type": "COMPLETE_REPORT|SAMPLE_RESULTS|MEASUREMENTS_ONLY|SUMMARY_ONLY|TEMPLATE",
  "includeCharts": true,
  "includeSamples": true,
  "includeRawData": false,
  "template": "template_name"
}
```

#### GET /api/study-executions/{id}/exports
Pobiera listę eksportów dla wykonania badania.

### 6. Zapis w systemie EDITH

#### POST /api/study-executions/{id}/save
Zapisuje kompletne dane wykonania w systemie EDITH.

## Statusy

### Statusy wykonania (ExecutionStatus)
- `NOT_STARTED` - Nie rozpoczęte
- `IN_PROGRESS` - W trakcie
- `PAUSED` - Wstrzymane
- `COMPLETED` - Zakończone
- `FAILED` - Nieudane
- `CANCELLED` - Anulowane

### Statusy próbek (SampleStatus)
- `PENDING` - Oczekująca
- `IN_PROGRESS` - W trakcie
- `COMPLETED` - Zakończona
- `FAILED` - Nieudana
- `SKIPPED` - Pominięta

### Formaty eksportu (ExportFormat)
- `PDF` - Dokument PDF
- `EXCEL` - Arkusz Excel
- `CSV` - Plik CSV
- `JSON` - Format JSON

## Kody błędów

- `EXECUTION_NOT_FOUND` - Wykonanie nie znalezione
- `SAMPLE_NOT_FOUND` - Próbka nie znaleziona
- `INVALID_STATUS_TRANSITION` - Nieprawidłowa zmiana statusu
- `VALIDATION_FAILED` - Błąd walidacji
- `DATABASE_ERROR` - Błąd bazy danych

## Przykłady użycia

### 1. Tworzenie i wykonanie badania

```typescript
// 1. Stwórz wykonanie badania
const execution = await fetch('/api/study-executions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    studyId: 'study-1',
    studyName: 'Test wytrzymałości',
    protocolName: 'ASTM D638',
    category: 'Mechanical',
    operatorId: 'operator-1',
    environment: { temperature: 23.5, humidity: 45.2 },
    samples: [
      { name: 'Próbka 1', material: 'ABS' }
    ]
  })
});

// 2. Rozpocznij wykonanie
await fetch(`/api/study-executions/${execution.id}/start`, {
  method: 'POST'
});

// 3. Rozpocznij próbkę
const sample = execution.samples[0];
await fetch(`/api/study-executions/samples/${sample.id}/start`, {
  method: 'POST'
});

// 4. Dodaj pomiar
await fetch('/api/study-executions/measurements', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sampleId: sample.id,
    stepId: 'step-1',
    measurementId: 'tensile-strength',
    value: 45.6,
    unit: 'MPa',
    operator: 'operator-1'
  })
});

// 5. Zakończ próbkę
await fetch(`/api/study-executions/samples/${sample.id}/complete`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    quality: 'pass',
    notes: 'Próbka zakończona pomyślnie'
  })
});

// 6. Zakończ wykonanie
await fetch(`/api/study-executions/${execution.id}/complete`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    summary: 'Wszystkie próbki zakończone pomyślnie'
  })
});

// 7. Eksportuj wyniki
await fetch(`/api/study-executions/${execution.id}/exports`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    format: 'PDF',
    type: 'COMPLETE_REPORT',
    includeCharts: true
  })
});
```

### 2. Integracja z frontendem

```typescript
// Hook do zarządzania wykonaniami badań
export const useStudyExecution = (executionId: string) => {
  const [execution, setExecution] = useState(null);
  const [loading, setLoading] = useState(true);

  const startExecution = async () => {
    const response = await fetch(`/api/study-executions/${executionId}/start`, {
      method: 'POST'
    });
    const result = await response.json();
    setExecution(result.data);
    return result;
  };

  const addMeasurement = async (measurement: any) => {
    const response = await fetch('/api/study-executions/measurements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(measurement)
    });
    const result = await response.json();
    // Refresh execution data
    fetchExecution();
    return result;
  };

  return {
    execution,
    loading,
    startExecution,
    addMeasurement
  };
};
```

## Integracja z bazą danych

Moduł używa Prisma ORM do komunikacji z bazą danych PostgreSQL. Wszystkie dane są zapisywane logicznie zgodnie ze schematem:

- `StudyExecution` - główne wykonanie badania
- `StudyExecutionSample` - próbki w ramach wykonania
- `StudyMeasurement` - pomiary dla próbek
- `StudyExport` - eksporty wyników

## Konfiguracja

1. **Zmienne środowiskowe:**
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/edith
   ```

2. **Instalacja zależności:**
   ```bash
   npm install @prisma/client express cors
   npm install -D @types/express @types/cors
   ```

3. **Integracja z głównym serwerem:**
   ```typescript
   import { studyExecutionRouter } from './study-execution';
   app.use('/api', studyExecutionRouter);
   ```

## Bezpieczeństwo

- Wszystkie endpointy wymagają autoryzacji (middleware `authMiddleware`)
- Walidacja wszystkich danych wejściowych
- Sanityzacja odpowiedzi
- Logowanie wszystkich operacji

## Performance

- Paginacja dla dużych zbiorów danych
- Indeksy bazodanowe na kluczowych polach
- Lazy loading dla relacji
- Cache dla często używanych danych
