export const ul94Protocol = {
  id: 'ul-94',
  title: 'UL 94 - Test Palności Plastików',
  description: 'Standardowe testy palności materiałów plastikowych według klasyfikacji UL 94 z określeniem klas odporności ogniowej.',
  category: 'fire',
  estimatedDuration: '90-120 minut na serię próbek',
  difficulty: 'intermediate',
  
  overview: {
    purpose: 'Klasyfikacja materiałów plastikowych pod względem palności i odporności na rozprzestrzenianie płomienia.',
    scope: 'Stosowane do oceny bezpieczeństwa pożarowego plastików w zastosowaniach elektronicznych i budowlanych.',
    principles: 'Próbki są poddawane działaniu kontrolowanego płomienia w określonych warunkach i oceniane według czasu dogarzania, kapania i rozprzestrzeniania płomienia.',
    standards: ['UL 94', 'IEC 60695-11-10', 'ASTM D3801', 'ISO 9772']
  },

  equipment: [
    { name: 'Palnik Bunsena', specification: 'Regulowany płomień, gaz propan lub metan' },
    { name: 'Uchwyt Próbek', specification: 'Metalowy, z możliwością mocowania próbek wertykalnie' },
    { name: 'Stoper', specification: 'Dokładność ±0.1 sekundy' },
    { name: 'Podłoże Testowe', specification: 'Sucha wata bawełniana' },
    { name: 'Okap Wyciągowy', specification: 'Skuteczne odprowadzanie dymów' },
    { name: 'Linijka', specification: 'Dokładność ±0.5mm' },
    { name: 'Suwmiarka', specification: 'Do pomiaru grubości próbek' },
    { name: 'Waga', specification: 'Dokładność ±0.01g' }
  ],

  materials: [
    'Próbki testowe (125 x 13 x grubość mm)',
    'Wata bawełniana (sucha)',
    'Gaz do palnika (propan lub metan)',
    'Zapalniczka lub zapalarki',
    'Rękawice termiczne',
    'Okulary ochronne',
    'Środki gaśnicze (piasek, CO₂)'
  ],

  safetyGuidelines: [
    'Pracuj w dobrze wentylowanym pomieszczeniu z okapem',
    'Noś okulary ochronne i rękawice termiczne',
    'Przygotuj środki gaśnicze przed rozpoczęciem testu',
    'Nie pozostawiaj płonących próbek bez nadzoru',
    'Sprawdź drożność wyjść ewakuacyjnych',
    'Przygotuj pojemnik na gorące resztki próbek',
    'Nie wdychaj dymów z palących się plastików'
  ],

  testConditions: {
    temperature: '23±2°C',
    humidity: '50±5% RH',
    conditioning: 'Minimum 48 godzin w standardowych warunkach',
    flameHeight: '20mm ±2mm',
    flameApplication: '10 sekund dla pierwszego przyłożenia',
    sampleOrientation: 'Wertykalna, długą krawędzią w górę',
    testAtmosphere: 'Powietrze w spokoju (bez przeciągów)'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Próbek',
      description: 'Przygotuj próbki zgodnie z wymaganiami UL 94',
      duration: '30 minut',
      instructions: [
        'Wytnij próbki o wymiarach 125×13×grubość mm',
        'Zmierz dokładnie wymiary i masę każdej próbki',
        'Sprawdź czy próbki nie mają pęknięć lub defektów',
        'Kondycjonuj próbki przez 48h w 23°C/50%RH',
        'Oznacz próbki numerami 1-5 dla każdej serii',
        'Przygotuj minimum 5 próbek na każdy test'
      ],
      tips: [
        'Próbki powinny być wycięte wzdłuż kierunku wtrysku',
        'Krawędzie muszą być gładkie, bez zadrapań',
        'Grubość powinna być jednolita na całej długości'
      ],
      safety: [
        'Używaj ostrych narzędzi ostrożnie',
        'Unikaj wdychania pyłu z cięcia',
        'Noś rękawice podczas manipulacji'
      ]
    },
    {
      id: 'setup-1',
      title: 'Przygotowanie Stanowiska',
      description: 'Ustaw stanowisko testowe zgodnie z UL 94',
      duration: '20 minut',
      instructions: [
        'Umieść stanowisk testowe pod okapem wyciągowym',
        'Zamocuj uchwyt próbek w pozycji wertykalnej',
        'Ustaw palnik na wysokość umożliwiającą płomień 20mm',
        'Umieść warstwę suchej waty bawełnianej pod próbką',
        'Sprawdź czy płomień jest stabilny i ma niebieski kolor',
        'Przygotuj stoper i materiały gaśnicze'
      ],
      tips: [
        'Odległość od dolnej krawędzi próbki do waty: 300mm',
        'Płomień powinien być regulowany na podstawie miedzi',
        'Sprawdź czy nie ma przeciągów powietrza'
      ],
      safety: [
        'Upewnij się o sprawności okapu wyciągowego',
        'Sprawdź dostępność środków gaśniczych',
        'Znajdź najbliższe wyjście ewakuacyjne'
      ]
    },
    {
      id: 'test-v0',
      title: 'Test V-0 (Pierwsze Przyłożenie)',
      description: 'Wykonaj pierwsze przyłożenie płomienia na 10 sekund',
      duration: '15 minut na próbkę',
      instructions: [
        'Zamocuj próbkę w uchwycie wertykalnie',
        'Przyłóż płomień do dolnej krawędzi próbki',
        'Utrzymuj płomień przez dokładnie 10 sekund',
        'Usuń płomień i uruchom stoper',
        'Mierz czas dogarzania (t1)',
        'Obserwuj czy próbka kapie lub płonie'
      ],
      tips: [
        'Płomień powinien dotykać próbkę na długości 6mm',
        'Zapisuj wszystkie obserwacje o kolorze płomienia',
        'Notuj czy występuje kapanie'
      ],
      safety: [
        'Nie dotykaj gorących próbek',
        'Obserwuj czy wata się nie zapala',
        'Bądź gotowy do interwencji gaśniczej'
      ]
    },
    {
      id: 'test-v1',
      title: 'Test V-1 (Drugie Przyłożenie)',
      description: 'Po dogaszeniu wykonaj drugie przyłożenie płomienia',
      duration: '15 minut na próbkę',
      instructions: [
        'Poczekaj aż próbka całkowicie się dogasi',
        'Ponownie przyłóż płomień do tej samej pozycji',
        'Utrzymuj płomień przez 10 sekund',
        'Usuń płomień i zmierz czas dogarzania (t2)',
        'Obserwuj całkowity czas płonienia',
        'Sprawdź czy wata się zapaliła'
      ],
      tips: [
        'Drugie przyłożenie wykonuj natychmiast po dogaszeniu',
        'Całkowity czas płonienia (t1+t2) jest kluczowy',
        'Dokumentuj wszelkie nietypowe zachowania'
      ],
      safety: [
        'Monitoruj temperaturę uchwytu',
        'Sprawdzaj czy nie ma rozżarzonych kropel',
        'Kontynuuj obserwację waty bawełnianej'
      ]
    },
    {
      id: 'eval-1',
      title: 'Ocena Wyników',
      description: 'Oceń próbkę zgodnie z kryteriami klasyfikacji',
      duration: '10 minut na próbkę',
      instructions: [
        'Zmierz długość spalenia od dolnej krawędzi',
        'Sprawdź czy płomień dotarł do uchwytu (125mm)',
        'Oceń stan waty bawełnianej pod próbką',
        'Zapisz maksymalny czas dogarzania pojedynczej próbki',
        'Oblicz całkowity czas płonienia dla 5 próbek',
        'Określ klasę palności wg UL 94'
      ],
      tips: [
        'V-0: t1 i t2 ≤ 10s, suma ≤ 50s, brak zapalenia waty',
        'V-1: t1 i t2 ≤ 30s, suma ≤ 250s, brak zapalenia waty',
        'V-2: jak V-1, ale możliwe zapalenie waty',
        'Jeśli nie spełnia V-2, materiał nie jest klasyfikowany'
      ],
      safety: [
        'Poczekaj na całkowite ostygnięcie przed manipulacją',
        'Usuń bezpiecznie resztki próbek',
        'Wyczyść stanowisko z resztek'
      ]
    },
    {
      id: 'test-hz',
      title: 'Test Poziomy HB (Opcjonalny)',
      description: 'Wykonaj test poziomy dla materiałów niespełniających V',
      duration: '20 minut na próbkę',
      instructions: [
        'Umieść próbkę poziomo w uchwycie',
        'Oznacz linię 25mm i 100mm od końca',
        'Przyłóż płomień przez 30 sekund',
        'Usuń płomień i mierz prędkość spalania',
        'Sprawdź czy płomień dociera do linii 100mm',
        'Oblicz prędkość spalania mm/min'
      ],
      tips: [
        'HB: prędkość ≤ 40mm/min dla grubości 3-13mm',
        'HB: prędkość ≤ 75mm/min dla grubości < 3mm',
        'Lub płomień dogasa przed linią 100mm'
      ],
      safety: [
        'Próbka może intensywnie kapać w pozycji poziomej',
        'Zwiększona uwaga na rozprzestrzenianie płomienia',
        'Przygotuj większą ilość środków gaśniczych'
      ]
    }
  ],

  calculations: {
    burningTime: 't1 + t2 = czas dogarzania po każdym przyłożeniu [s]',
    totalTime: 'Σ(t1 + t2) dla 5 próbek [s]',
    burningRate: 'Prędkość = 75mm / czas spalania [mm/min]',
    classification: 'Klasa UL 94 na podstawie czasów i obserwacji',
    where: {
      't1': 'czas dogarzania po pierwszym przyłożeniu [s]',
      't2': 'czas dogarzania po drugim przyłożeniu [s]',
      '75mm': 'odległość między liniami 25mm i 100mm'
    }
  },

  acceptanceCriteria: {
    sampleNumber: 'Minimum 5 próbek dla każdego testu',
    conditioning: '48 godzin w standardowych warunkach',
    flameHeight: '20±2mm płomień niebieski',
    applicationTime: 'Dokładnie 10 sekund dla każdego przyłożenia',
    timing: 'Pomiar czasu ±0.1 sekundy'
  },

  commonIssues: [
    {
      problem: 'Nierównomierne spalanie próbek',
      causes: [
        'Nierównomierna grubość próbek',
        'Różna orientacja włókien',
        'Niejednorodność materiału',
        'Defekty powierzchni'
      ],
      solutions: [
        'Sprawdź jednorodność próbek',
        'Wytnij próbki w tym samym kierunku',
        'Użyj materiału z jednej partii',
        'Wygładź powierzchnie przed testem'
      ]
    },
    {
      problem: 'Trudności z zapałeniem próbek',
      causes: [
        'Za niski płomień',
        'Materiał bardzo odporny na ogień',
        'Wilgotne próbki',
        'Niewłaściwy gaz do palnika'
      ],
      solutions: [
        'Sprawdź wysokość płomienia (20mm)',
        'Wydłuż czas przyłożenia płomienia',
        'Dosusz próbki dodatkowo',
        'Użyj czystego propanu'
      ]
    },
    {
      problem: 'Próbki płoną zbyt długo',
      causes: [
        'Brak retardantów płomienia',
        'Za grube próbki',
        'Materiał z dodatkami łatwopalnymi',
        'Nieprawidłowe warunki testu'
      ],
      solutions: [
        'Sprawdź skład materiału',
        'Zmniejsz grubość próbek',
        'Sprawdź obecność plastyfikatorów',
        'Sprawdź warunki otoczenia'
      ]
    }
  ],

  typicalValues: {
    'PC/ABS V-0': 't1, t2 ≤ 5s, brak kapania',
    'PC V-0': 't1, t2 ≤ 8s, możliwe kapanie',
    'ABS V-2': 't1, t2 ≤ 25s, kapanie',
    'PP HB': 'spalanie 25-40 mm/min',
    'PE HB': 'spalanie 20-35 mm/min',
    'PS V-2': 't1, t2 ≤ 30s, silne kapanie',
    'POM HB': 'spalanie 15-25 mm/min'
  },

  references: [
    'UL 94 - Standard for Safety of Flammability of Plastic Materials for Parts',
    'IEC 60695-11-10 - Fire hazard testing - Part 11-10: Test flames - 50 W horizontal and vertical flame test methods',
    'ASTM D3801 - Standard Test Method for Measuring the Comparative Burning Characteristics',
    'ISO 9772 - Cellular plastics - Determination of horizontal burning characteristics'
  ]
};
