# System Eksportu EDITH - Dokumentacja

## Przegląd

System eksportu EDITH umożliwia generowanie profesjonalnych raportów z wyników badań w formatach PDF i Excel. System składa się z trzech głównych serwisów:

- **PDFExportService** - Generowanie raportów PDF z pełnym formatowaniem
- **ExcelExportService** - Eksport danych do arkuszy Excel z wieloma zakładkami
- **ChartExportService** - Eksport wykresów jako obrazy

## Struktura Plików

```
src/services/export/
├── index.ts                 # Główny serwis eksportu
├── PDFExportService.ts      # Serwis eksportu PDF
├── ExcelExportService.ts    # Serwis eksportu Excel
├── ChartExportService.ts    # Serwis eksportu wykresów
├── ExportTestService.ts     # Testy serwisu
└── README.md               # Ta dokumentacja
```

## Instalacja Zależności

Wymagane pakiety NPM:
```bash
npm install jspdf jspdf-autotable html2canvas xlsx file-saver
npm install --save-dev @types/file-saver
```

## Podstawowe Użycie

### Import Serwisu
```typescript
import { exportService } from '../../../../services/export';
```

### Eksport Kompletnego Raportu PDF
```typescript
await exportService.exportStudyToPDF(execution);
```

### Eksport Danych do Excel
```typescript
await exportService.exportStudyToExcel(execution);
```

### Eksport Wszystkich Formatów
```typescript
await exportService.exportStudyToAllFormats(execution);
```

## Dostępne Metody

### ExportService

#### `exportStudyToPDF(execution: StudyExecution): Promise<void>`
Generuje kompletny raport PDF zawierający:
- Informacje o badaniu
- Warunki środowiskowe
- Przegląd próbek
- Statystyki wykonania
- Szczegółowe wyniki

#### `exportSampleResultsToPDF(execution: StudyExecution): Promise<void>`
Generuje szczegółowy raport PDF próbek zawierający:
- Informacje o każdej próbce
- Tabele pomiarów
- Notatki operatora

#### `exportStudyToExcel(execution: StudyExecution): Promise<void>`
Generuje plik Excel z arkuszami:
- **Podsumowanie** - Podstawowe informacje o badaniu
- **Próbki** - Lista wszystkich próbek
- **Statystyki** - Szczegółowe statystyki
- **Pomiary** - Wszystkie pomiary
- **Wyniki** - Podsumowanie wyników

#### `exportSampleResultsToExcel(execution: StudyExecution): Promise<void>`
Generuje plik Excel skupiony na wynikach próbek

#### `exportSampleTemplate(): Promise<void>`
Generuje szablon Excel do importu próbek

#### `validateExportData(execution: StudyExecution): boolean`
Waliduje dane przed eksportem

### ChartExportService

#### `exportChartAsPNG(chartElement: HTMLElement, filename?: string): Promise<void>`
Eksportuje wykres jako obraz PNG

#### `exportChartAsJPEG(chartElement: HTMLElement, filename?: string, quality?: number): Promise<void>`
Eksportuje wykres jako obraz JPEG

#### `convertChartToBase64(chartElement: HTMLElement): Promise<string>`
Konwertuje wykres na base64 (do użycia w PDF)

## Konfiguracja PDF

### Ustawienia Strony
- Format: A4
- Orientacja: Portret
- Marginesy: 20mm
- Czcionka: Helvetica

### Kolory Nagłówków
- Tabela próbek: `#2980b9` (niebieski)
- Tabela pomiarów: `#3498db` (jasnoniebieski)
- Tekst nagłówków: biały

### Automatyczne Łamanie Stron
System automatycznie zarządza łamaniem stron dla:
- Długich tabel
- Szczegółowych pomiarów
- Wielostronicowych raportów

## Konfiguracja Excel

### Struktura Arkuszy
1. **Podsumowanie** - Ogólne informacje
2. **Próbki** - Lista próbek z podstawowymi danymi
3. **Statystyki** - Analiza statystyczna
4. **Pomiary** - Szczegółowe dane pomiarowe
5. **Wyniki** - Wyniki i zalecenia

### Formatowanie
- Nagłówki z pogrubieniem
- Automatyczne dopasowanie szerokości kolumn
- Dane w języku polskim

## Obsługa Błędów

### Walidacja Danych
```typescript
try {
  exportService.validateExportData(execution);
} catch (error) {
  console.error('Błąd walidacji:', error.message);
}
```

### Typowe Błędy
- `"Brak danych badania do eksportu"` - Pusty obiekt execution
- `"Niepełne dane badania"` - Brak ID lub nazwy badania
- `"Brak próbek do eksportu"` - Pusta tablica próbek

## Tłumaczenia

System automatycznie tłumaczy statusy na język polski:

### Statusy Próbek
- `PENDING` → "Oczekuje"
- `IN_PROGRESS` → "W trakcie"
- `COMPLETED` → "Ukończone"
- `FAILED` → "Nieudane"
- `SKIPPED` → "Pominięte"

### Statusy Wykonania
- `NOT_STARTED` → "Nie rozpoczęte"
- `IN_PROGRESS` → "W trakcie"
- `PAUSED` → "Wstrzymane"
- `COMPLETED` → "Ukończone"
- `FAILED` → "Nieudane"
- `CANCELLED` → "Anulowane"

### Statusy Wyników
- `PASSED` → "Zaliczone"
- `FAILED` → "Niezaliczone"
- `PENDING` → "Oczekuje"
- `PARTIAL` → "Częściowe"

## Testowanie

### Uruchomienie Testów
W konsoli deweloperskiej przeglądarki:
```javascript
window.testExport(); // Uruchom wszystkie testy
```

### Poszczególne Testy
```javascript
// Test walidacji
window.exportTestService.testValidation();

// Test eksportu szablonu
await window.exportTestService.testTemplateExport();

// Test eksportu PDF (pobierze plik)
await window.exportTestService.testPDFExport();

// Test eksportu Excel (pobierze plik)
await window.exportTestService.testExcelExport();
```

## Przykładowe Użycie w Komponencie

```typescript
import React, { useState } from 'react';
import { exportService } from '../../../../services/export';

const ExportComponent: React.FC<{ execution: StudyExecution }> = ({ execution }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: 'pdf' | 'excel' | 'all') => {
    setIsExporting(true);
    try {
      switch (type) {
        case 'pdf':
          await exportService.exportStudyToPDF(execution);
          break;
        case 'excel':
          await exportService.exportStudyToExcel(execution);
          break;
        case 'all':
          await exportService.exportStudyToAllFormats(execution);
          break;
      }
      alert('Eksport zakończony pomyślnie!');
    } catch (error) {
      alert('Błąd podczas eksportu: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <button onClick={() => handleExport('pdf')} disabled={isExporting}>
        Eksport PDF
      </button>
      <button onClick={() => handleExport('excel')} disabled={isExporting}>
        Eksport Excel
      </button>
      <button onClick={() => handleExport('all')} disabled={isExporting}>
        Eksport Wszystkich
      </button>
    </div>
  );
};
```

## Rozszerzanie Funkcjonalności

### Dodanie Nowego Formatu Eksportu

1. Stwórz nowy serwis (np. `CSVExportService.ts`)
2. Dodaj metodę do `ExportService`
3. Zaktualizuj interfejs użytkownika

### Dodanie Nowych Pól do Raportu

1. Rozszerz interfejs `StudyExecution`
2. Zaktualizuj metody w `PDFExportService` i `ExcelExportService`
3. Dodaj tłumaczenia jeśli potrzebne

## Wydajność

### Optymalizacje PDF
- Kompresja obrazów: automatyczna
- Generowanie w tle: obsługiwane
- Łamanie stron: automatyczne

### Optymalizacje Excel
- Kompresja pliku: włączona
- Optymalizacja pamięci: automatyczna
- Równoległy eksport: obsługiwany

## Zgodność Przeglądarek

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Bezpieczeństwo

- Walidacja danych wejściowych
- Escape'owanie tekstów
- Brak przechowywania danych po eksporcie
- Obsługa CORS dla obrazów
