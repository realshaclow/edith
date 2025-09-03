# Komponenty Regulaminu i Polityki Prywatności

## Opis

Profesjonalne komponenty do wyświetlania regulaminu i polityki prywatności zgodnie z RODO i polskim prawem.

## Komponenty

### 1. `TermsAndConditions`
Główny komponent modal z pełną treścią regulaminu.

```tsx
import { TermsAndConditions } from '../pages/Auth';

// Podstawowe użycie
<TermsAndConditions
  open={showTerms}
  onClose={() => setShowTerms(false)}
/>

// Z przyciskiem akceptacjia
<TermsAndConditions
  open={showTerms}
  onClose={() => setShowTerms(false)}
  onAccept={() => {
    // Logika po akceptacji
    console.log('Regulamin zaakceptowany');
  }}
  showAcceptButton={true}
/>
```

### 2. `TermsAndConditionsButton`
Przycisk który otwiera modal z regulaminem.

```tsx
import { TermsAndConditionsButton } from '../pages/Auth';

// Prosty przycisk
<TermsAndConditionsButton />

// Stylizowany przycisk
<TermsAndConditionsButton
  variant="outlined"
  size="large"
  fullWidth
  showAcceptButton={true}
  onAccept={() => {
    // Logika po akceptacji
  }}
>
  Przeczytaj Regulamin
</TermsAndConditionsButton>
```

## Funkcje

### ✅ Pełna zgodność z RODO
- Szczegółowe informacje o administratorze danych
- Opis celów i podstaw prawnych przetwarzania
- Informacje o prawach użytkownika
- Okresy przechowywania danych

### ✅ Polityka Cookies
- Opis rodzajów używanych cookies
- Instrukcje zarządzania cookies w różnych przeglądarkach
- Kategoryzacja cookies (niezbędne, funkcjonalne, analityczne)

### ✅ Regulamin serwisu
- Postanowienia ogólne
- Zasady rejestracji i korzystania
- Ochrona danych badawczych
- Bezpieczeństwo

### ✅ Responsywność
- Pełnoekranowy modal na urządzeniach mobilnych
- Accordion z sekcjami dla lepszej nawigacji
- Profesjonalny design z Material-UI

### ✅ Dostępność
- Właściwe etykiety ARIA
- Nawigacja klawiaturą
- Semantic HTML

## Integracja z formularzem rejestracji

Komponent jest już zintegrowany z `RegisterForm`:

```tsx
// W RegisterForm.tsx
<FormControlLabel
  control={
    <Checkbox
      checked={formData.acceptTerms}
      onChange={handleInputChange('acceptTerms')}
    />
  }
  label={
    <Typography variant="body2">
      Akceptuję{' '}
      <Link 
        component="button" 
        onClick={() => setShowTerms(true)}
      >
        Regulamin i Politykę Prywatności
      </Link>
      {' '}*
    </Typography>
  }
/>

<TermsAndConditions
  open={showTerms}
  onClose={() => setShowTerms(false)}
  onAccept={() => {
    setFormData(prev => ({ ...prev, acceptTerms: true }));
  }}
  showAcceptButton={true}
/>
```

## Personalizacja

### Zmiana danych kontaktowych
Edytuj sekcje z danymi firmy w `TermsAndConditions.tsx`:

```tsx
// Sekcja "Administrator danych"
<Typography variant="body2" paragraph>
  <strong>Administrator:</strong> [Twoja Nazwa Firmy]
</Typography>
<Typography variant="body2" paragraph>
  <strong>Adres:</strong> [Twój Adres]
</Typography>
<Typography variant="body2" paragraph>
  <strong>E-mail:</strong> privacy@twoja-domena.com
</Typography>
```

### Dodanie własnych sekcji
Dodaj nowe `Accordion` komponenty z własnymi sekcjami:

```tsx
<Accordion 
  expanded={expandedPanel === 'custom'} 
  onChange={handlePanelChange('custom')}
>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6">Własna Sekcja</Typography>
  </AccordionSummary>
  <AccordionDetails>
    {/* Twoja treść */}
  </AccordionDetails>
</Accordion>
```

## Aktualizacje treści

Pamiętaj o regularnym aktualizowaniu:
1. Daty ostatniej aktualizacji (`currentDate`)
2. Danych kontaktowych firmy
3. Informacji o używanych cookies
4. Postanowień regulaminu zgodnie ze zmianami w prawie

## Zgodność prawna

⚠️ **Ważne:** Ten komponent zawiera przykładową treść. Przed użyciem produkcyjnym skonsultuj się z prawnikiem w celu:
- Dostosowania treści do specyfiki Twojej działalności
- Weryfikacji zgodności z aktualnym stanem prawnym
- Sprawdzenia completności informacji RODO
