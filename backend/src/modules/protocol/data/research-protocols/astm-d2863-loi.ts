export const astmD2863Protocol = {
  id: 'astm-d2863',
  title: 'ASTM D2863 - Indeks Tlenowy (LOI)',
  description: 'Standardowy protokół do określania minimalnej koncentracji tlenu potrzebnej do podtrzymania płomienowego spalania plastików.',
  category: 'FIRE',
  estimatedDuration: '45-60 minut na materiał',
  difficulty: 'INTERMEDIATE',
  
  overview: {
    purpose: 'Określenie wskaźnika tlenowego (LOI) jako miary odporności materiału na zapłon i spalanie w atmosferze o obniżonej zawartości tlenu.',
    scope: 'Stosowane do oceny właściwości ogniowych plastików, włókien, tkanin i innych materiałów organicznych.',
    principles: 'Materiał jest zapalany w kolumnie gazowej o kontrolowanej mieszaninie tlen-azot, a koncentracja tlenu jest regulowana do osiągnięcia krytycznego punktu spalania.',
    standards: ['ASTM D2863-19', 'ISO 4589-2', 'BS 2782', 'EN ISO 4589-2']
  },

  equipment: [
    { name: 'Kolumna LOI', specification: 'Szklana kolumna o średnicy 75-100mm, wysokość minimum 300mm' },
    { name: 'Kontroler Przepływu', specification: 'Precyzyjny regulator mieszaniny O₂/N₂' },
    { name: 'Analizator Tlenu', specification: 'Dokładność ±0.1% O₂' },
    { name: 'Płyty Rozprowadzające', specification: 'Szklane kulki lub sito ceramiczne' },
    { name: 'Zapalniczka', specification: 'Palnik propanowy lub elektryczny' },
    { name: 'Stoper', specification: 'Dokładność ±0.1 sekundy' },
    { name: 'Uchwyt Próbek', specification: 'Metalowy, regulowany' },
    { name: 'Suwmiarka', specification: 'Do pomiaru wymiarów próbek' }
  ],

  materials: [
    'Próbki testowe (100-150mm długość, 6.5-10mm szerokość)',
    'Tlen techniczny (99.5% czystości)',
    'Azot techniczny (99.9% czystości)',
    'Gaz propan (do zapalniczki)',
    'Rękawice termiczne',
    'Okulary ochronne',
    'Linijka milimetrowa'
  ],

  safetyGuidelines: [
    'Pracuj w dobrze wentylowanym pomieszczeniu',
    'Uważaj na wysokie stężenia tlenu - zwiększają ryzyko pożaru',
    'Nie pal papierosów w pobliżu aparatury',
    'Sprawdź szczelność instalacji gazowej przed użyciem',
    'Noś okulary ochronne podczas zapalarnia próbek',
    'Przygotuj środki gaśnicze na wypadek awaryjnego zapłonu',
    'Nie pozostawiaj płonących próbek bez nadzoru'
  ],

  testConditions: {
    temperature: '23±2°C',
    humidity: '50±5% RH',
    conditioning: 'Minimum 24 godziny w standardowych warunkach',
    gasFlow: '40±10 mm/s prędkość liniowa gazu',
    oxygenRange: 'Typowo 16-28% O₂ w N₂',
    ignitionTime: '5 sekund maksimum',
    burningCriterion: 'Spalanie przez minimum 3 minuty lub spalenie 50mm długości'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Próbek',
      description: 'Przygotuj próbki zgodnie z wymaganiami ASTM D2863',
      duration: '20 minut',
      instructions: [
        'Wytnij próbki o wymiarach 100-150 × 6.5-10 × grubość mm',
        'Sprawdź czy próbki mają gładkie krawędzie',
        'Zmierz dokładnie wymiary każdej próbki',
        'Oznacz linię 20mm od górnej krawędzi próbki',
        'Kondycjonuj próbki przez 24h w 23°C/50%RH',
        'Przygotuj minimum 5 próbek dla każdego materiału'
      ],
      tips: [
        'Próbki powinny być cięte wzdłuż kierunku głównego',
        'Unikaj próbek z defektami i pęknięciami',
        'Grubość powinna być jednolita na całej długości'
      ],
      safety: [
        'Używaj ostrych narzędzi ostrożnie',
        'Noś rękawice podczas cięcia',
        'Unikaj wdychania pyłu z cięcia'
      ]
    },
    {
      id: 'setup-1',
      title: 'Przygotowanie Aparatury',
      description: 'Ustaw i skalibruj aparat LOI',
      duration: '15 minut',
      instructions: [
        'Sprawdź szczelność kolumny i połączeń gazowych',
        'Skalibruj analizator tlenu z użyciem powietrza (20.9% O₂)',
        'Ustaw przepływ gazów na 40mm/s prędkości liniowej',
        'Sprawdź działanie regulatorów O₂ i N₂',
        'Ustaw mieszankę startową na około 21% O₂',
        'Poczekaj 5 minut na stabilizację przepływu'
      ],
      tips: [
        'Przepływ powinien być laminarny, bez turbulencji',
        'Sprawdź czy nie ma nieszczełności w systemie',
        'Analizator powinien pokazywać stabilne odczyty'
      ],
      safety: [
        'Sprawdź szczelność przed uruchomieniem gazów',
        'Nie przekraczaj maksymalnego ciśnienia w systemie',
        'Upewnij się o sprawności wentylacji'
      ]
    },
    {
      id: 'test-1',
      title: 'Test Wstępny',
      description: 'Przeprowadź wstępny test dla określenia zakresu LOI',
      duration: '15 minut',
      instructions: [
        'Zamocuj pierwszą próbkę w uchwycie wertykalnie',
        'Ustaw koncentrację tlenu na 21% (powietrze)',
        'Zapał górną krawędź próbki',
        'Obserwuj czy próbka płonie przez 3 minuty',
        'Jeśli płonie - zmniejsz O₂, jeśli nie - zwiększ',
        'Powtarzaj aż znajdziesz przybliżone LOI'
      ],
      tips: [
        'Pierwsze próby służą do oszacowania zakresu',
        'Duże zmiany stężenia (2-3%) na początku',
        'Notuj zachowanie płomienia (kolor, intensywność)'
      ],
      safety: [
        'Obserwuj próbkę przez cały czas płonienia',
        'Nie dotykaj gorących części aparatury',
        'Bądź gotowy do awaryjnego wyłączenia'
      ]
    },
    {
      id: 'test-2',
      title: 'Precyzyjne Określenie LOI',
      description: 'Wyznacz dokładną wartość wskaźnika tlenowego',
      duration: '30 minut',
      instructions: [
        'Rozpocznij od stężenia o 1% niższego niż wstępny LOI',
        'Testuj kolejne próbki zwiększając O₂ o 0.2%',
        'Dla każdego stężenia testuj minimum 3 próbki',
        'Zapisuj czy próbka płonie >3 min czy <3 min',
        'Znajdź stężenie gdzie 50% próbek płonie',
        'To jest wartość LOI dla materiału'
      ],
      tips: [
        'LOI = najniższe stężenie O₂ podtrzymujące spalanie',
        'Używaj małych kroków stężenia (0.2-0.5%)',
        'Dokumentuj szczegółowo każdy test'
      ],
      safety: [
        'Monitoruj każdą próbkę przez pełny czas',
        'Sprawdzaj temperaturę aparatury',
        'Kontynuuj wentylację'
      ]
    },
    {
      id: 'analysis-1',
      title: 'Analiza Wyników',
      description: 'Oblicz końcowy wskaźnik tlenowy i oceń wyniki',
      duration: '10 minut',
      instructions: [
        'Sporządź tabelę z wszystkimi stężeniami i wynikami',
        'Oblicz średnią z ostatnich 6 pomiarów wokół LOI',
        'Określ niepewność pomiaru',
        'Porównaj z danymi literaturowymi dla materiału',
        'Oceń powtarzalność wyników',
        'Zapisz końcowy wynik LOI z niepewnością'
      ],
      tips: [
        'LOI wykazuje dobrą powtarzalność ±0.5%',
        'Sprawdź czy wyniki są logiczne dla danego materiału',
        'Dokumentuj nietypowe obserwacje'
      ],
      safety: [
        'Wyłącz gazy po zakończeniu testów',
        'Usuń resztki próbek bezpiecznie',
        'Wyczyść kolumnę z pozostałości'
      ]
    }
  ],

  calculations: {
    limitingOxygenIndex: 'LOI = stężenie O₂ [%] przy którym 50% próbek płonie ≥3 min',
    uncertainty: 'Niepewność = odchylenie standardowe z serii pomiarów',
    classification: 'LOI > 28% - trudno zapalne, LOI < 21% - łatwo zapalne',
    where: {
      'LOI': 'Limiting Oxygen Index [% O₂]',
      '21%': 'stężenie tlenu w powietrzu',
      '3 min': 'minimalny czas spalania lub 50mm długości'
    }
  },

  acceptanceCriteria: {
    sampleNumber: 'Minimum 10 próbek na materiał',
    precision: 'Powtarzalność ±0.5% O₂',
    gasFlow: '40±10 mm/s prędkość liniowa',
    oxygenAccuracy: '±0.1% dokładność analizy O₂',
    ignitionConsistency: 'Jednolite warunki zapłonu dla wszystkich próbek'
  },

  commonIssues: [
    {
      problem: 'Niestabilne płomienie',
      causes: [
        'Za duży lub za mały przepływ gazu',
        'Turbulencje w kolumnie',
        'Nierównomierne próbki',
        'Niestabilne stężenie tlenu'
      ],
      solutions: [
        'Dostosuj przepływ do 40mm/s',
        'Sprawdź płyty rozprowadzające',
        'Użyj próbek o równomiernej grubości',
        'Sprawdź stabilność mieszania gazów'
      ]
    },
    {
      problem: 'Trudności z zapłonem',
      causes: [
        'Za niskie stężenie tlenu',
        'Wilgotne próbki',
        'Materiał bardzo trudno zapalny',
        'Słaby płomień zapalnika'
      ],
      solutions: [
        'Rozpocznij od wyższego stężenia O₂',
        'Dosusz próbki dodatkowo',
        'Użyj silniejszego źródła zapłonu',
        'Sprawdź działanie zapalniczki'
      ]
    },
    {
      problem: 'Rozrzut wyników',
      causes: [
        'Niejednorodność materiału',
        'Różne grubości próbek',
        'Niestabilne warunki testu',
        'Błędy w procedurze'
      ],
      solutions: [
        'Użyj materiału z jednej partii',
        'Kontroluj wymiary próbek ściśle',
        'Stabilizuj warunki otoczenia',
        'Sprawdź kalibrację aparatury'
      ]
    }
  ],

  typicalValues: {
    'Polietylen (PE)': '17-19% O₂',
    'Polipropylen (PP)': '17-19% O₂',
    'Polistyren (PS)': '18-20% O₂',
    'PVC (z retardantami)': '35-45% O₂',
    'PC/ABS (z retardantami)': '25-35% O₂',
    'Poliamid (PA)': '20-25% O₂',
    'PTFE': '95% O₂ (nie płonie)',
    'Celuloza': '16-19% O₂'
  },

  references: [
    'ASTM D2863-19 - Standard Test Method for Measuring the Minimum Oxygen Concentration',
    'ISO 4589-2:2017 - Plastics - Determination of burning behaviour by oxygen index',
    'BS 2782-1:Method 141A - Determination of the oxygen index',
    'EN ISO 4589-2 - Plastics - Determination of burning behaviour by oxygen index'
  ]
};
