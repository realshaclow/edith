export const iso3451Protocol = {
  id: 'iso-3451',
  title: 'ISO 3451 - Oznaczanie Zawartości Popiołu',
  description: 'Standardowy protokół do określania zawartości popiołu w plastikach metodą spalania w temperaturze 850°C.',
  category: 'CHEMICAL',
  estimatedDuration: '4-6 godzin (z chłodzeniem)',
  difficulty: 'INTERMEDIATE',
  
  overview: {
    purpose: 'Określenie zawartości substancji nieorganicznych w plastikach poprzez pomiar masy pozostałości po spaleniu próbki.',
    scope: 'Stosowane do wszystkich rodzajów plastików zawierających wypełniacze nieorganiczne, pigmenty lub inne dodatki mineralne.',
    principles: 'Próbka jest spalana w temperaturze 550°C lub 850°C w atmosferze powietrza do całkowitego usunięcia substancji organicznych.',
    standards: ['ISO 3451-1:2019', 'ISO 3451-4:2019', 'ASTM D5630', 'ASTM D2584']
  },

  equipment: [
    { name: 'Piec Muflowy', specification: 'Kontrola temperatury ±5°C, maksimum 900°C' },
    { name: 'Waga Analityczna', specification: 'Dokładność ±0.1mg' },
    { name: 'Tygielki Porcelanowe', specification: 'Odporne na wysoką temperaturę' },
    { name: 'Eksykator', specification: 'Z żelem krzemionkowym lub P₂O₅' },
    { name: 'Pęseta', specification: 'Stalowa, odporna na wysoką temperaturę' },
    { name: 'Termometr', specification: 'Zakres do 1000°C' },
    { name: 'Timer', specification: 'Precyzyjny czasomierz' },
    { name: 'Rękawice Termiczne', specification: 'Do manipulacji gorącymi tygielkami' }
  ],

  materials: [
    'Próbki testowe (1-2g)',
    'Tygielki porcelanowe',
    'Żel krzemionkowy lub P₂O₅',
    'Rękawice termiczne',
    'Rękawice laboratoryjne',
    'Etykiety żaroodporne'
  ],

  safetyGuidelines: [
    'Noś rękawice termiczne przy manipulacji gorącymi tygielkami',
    'Pracuj w dobrze wentylowanym pomieszczeniu',
    'Unikaj bezpośredniego kontaktu z gorącymi powierzchniami',
    'Sprawdź stabilność tygielków w piecu',
    'Używaj pęsety do przenoszenia próbek',
    'Nie pozostawiaj pieca bez nadzoru podczas pierwszej godziny'
  ],

  testConditions: {
    temperature: '550±25°C (standardowa) lub 850±25°C (wysoka)',
    atmosphere: 'Powietrze atmosferyczne',
    burnTime: 'Minimum 4 godziny lub do stałej masy',
    sampleMass: '1-2g próbki',
    coolingTime: 'Minimum 30 minut w ekssykatorze',
    preheatingRate: 'Stopniowe podgrzanie przez 30 minut'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Tygielków',
      description: 'Przygotuj i skalibruj tygielki porcelanowe',
      duration: '60 minut',
      instructions: [
        'Wyczyść tygielki wodą destylowaną',
        'Wysusz tygielki w suszarce przy 105°C przez 30 minut',
        'Umieść tygielki w piecu na 550°C na 30 minut',
        'Schłodź w ekssykatorze przez 30 minut',
        'Zważ puste tygielki (m₀)',
        'Powtórz żarzenie i ważenie do stałej masy'
      ],
      tips: [
        'Tygielki muszą być idealmente czyste',
        'Używaj zawsze tych samych tygielków dla powtórzeń',
        'Ważenie wykonuj natychmiast po wyjęciu z eksykatora'
      ],
      safety: [
        'Noś rękawice termiczne przy wyjmowaniu z pieca',
        'Uważaj na gorące tygielki',
        'Sprawdź czy tygielki nie mają pęknięć'
      ]
    },
    {
      id: 'prep-2',
      title: 'Przygotowanie Próbek',
      description: 'Przygotuj próbki do spalenia',
      duration: '15 minut',
      instructions: [
        'Wybierz reprezentatywne próbki materiału',
        'Pokrusz próbki na fragmenty 2-3mm',
        'Zważ dokładnie 1-2g próbki',
        'Umieść próbkę w przygotowanym tygielku',
        'Zapisz masę próbki (m₁)',
        'Przygotuj minimum 3 próbki równolegle'
      ],
      tips: [
        'Próbki nie powinny być za duże - mogą się nie spalić całkowicie',
        'Rozmieść próbkę równomiernie w tygielku',
        'Unikaj strat materiału podczas przenoszenia'
      ],
      safety: [
        'Noś rękawice podczas manipulacji próbkami',
        'Uważaj na ostre krawędzie po cięciu',
        'Nie wdychaj pyłu z materiału'
      ]
    },
    {
      id: 'burn-1',
      title: 'Wstępne Spalanie',
      description: 'Przeprowadź wstępne spalanie w niskiej temperaturze',
      duration: '60 minut',
      instructions: [
        'Umieść tygielki z próbkami w zimnym piecu',
        'Podnieś temperaturę stopniowo do 250°C przez 30 minut',
        'Utrzymuj 250°C przez 30 minut',
        'Obserwuj czy próbki nie płoną za intensywnie',
        'Sprawdź czy nie ma dymu z pieca',
        'Przygotuj do głównego spalania'
      ],
      tips: [
        'Powolne podgrzewanie zapobiega zajęciu się próbek',
        'Niektóre materiały mogą intensywnie się rozszerzać',
        'Otwórz lekko drzwiczki jeśli jest za dużo dymu'
      ],
      safety: [
        'Monitoruj proces przez pierwsze 30 minut',
        'Sprawdzaj czy nie ma nieprzyjemnych zapachów',
        'Upewnij się o dobrej wentylacji'
      ]
    },
    {
      id: 'burn-2',
      title: 'Główne Spalanie',
      description: 'Przeprowadź spalanie w docelowej temperaturze',
      duration: '240 minut',
      instructions: [
        'Podnieś temperaturę do 550°C przez 30 minut',
        'Utrzymuj 550°C przez minimum 4 godziny',
        'Sprawdzaj co godzinę czy próbki się spalają',
        'Kontynuuj do zaprzestania wydzielania dymu',
        'Obserwuj kolor pozostałości',
        'Przygotuj do chłodzenia'
      ],
      tips: [
        'Czas spalania może być dłuższy dla grubych próbek',
        'Popiół powinien być biały lub szary',
        'Czarny kolor oznacza niepełne spalenie'
      ],
      safety: [
        'Sprawdzaj temperaturę co godzinę',
        'Upewnij się że wentylacja działa',
        'Nie otwieraj pieca niepotrzebnie'
      ]
    },
    {
      id: 'cool-1',
      title: 'Chłodzenie i Ważenie',
      description: 'Schłodź próbki i zważ pozostałość',
      duration: '60 minut',
      instructions: [
        'Wyłącz piec i pozostaw drzwiczki lekko otwarte',
        'Chłodź do temperatury poniżej 200°C',
        'Przenieś tygielki do eksykatora',
        'Chłodź w eksykatorze przez 30 minut',
        'Zważ tygielki z popiołem (m₂)',
        'Sprawdź powtarzalność wyników'
      ],
      tips: [
        'Nie chłodź za szybko - tygielki mogą pęknąć',
        'Ważenie wykonuj natychmiast po wyjęciu z eksykatora',
        'Popiół łatwo chłonie wilgoć z powietrza'
      ],
      safety: [
        'Używaj rękawic termicznych',
        'Sprawdź czy tygielki nie są spękane',
        'Uważaj na różnice temperatur'
      ]
    },
    {
      id: 'calc-1',
      title: 'Obliczenia i Analiza',
      description: 'Oblicz zawartość popiołu i oceń wyniki',
      duration: '15 minut',
      instructions: [
        'Oblicz masę popiołu: m_popiołu = m₂ - m₀',
        'Oblicz zawartość popiołu: %popiołu = (m_popiołu/m₁) × 100%',
        'Sprawdź powtarzalność między próbkami',
        'Porównaj z oczekiwanymi wartościami',
        'Oceń kompletność spalania',
        'Zapisz końcowe wyniki'
      ],
      tips: [
        'Różnica między próbkami nie powinna przekraczać 0.2%',
        'Sprawdź czy wyniki są sensowne dla danego materiału',
        'Dokumentuj kolor i wygląd popiołu'
      ],
      safety: []
    }
  ],

  calculations: {
    ashContent: '%popiołu = [(m₂ - m₀) / m₁] × 100%',
    where: {
      'm₀': 'masa pustego tygielka [g]',
      'm₁': 'masa próbki [g]',
      'm₂': 'masa tygielka z popiołem [g]',
      '%popiołu': 'zawartość popiołu w próbce [%]'
    },
    uncertaintyCalculation: 'Oblicz odchylenie standardowe z minimum 3 pomiarów'
  },

  acceptanceCriteria: {
    repeatability: 'Różnica między pomiarami < 0.2% zawartości popiołu',
    completeBurning: 'Popiół biały lub jasnoszary, brak czarnych cząstek',
    minimumSamples: 'Minimum 3 niezależne pomiary',
    temperatureStability: 'Temperatura stabilna ±5°C podczas spalania',
    constantMass: 'Różnica między kolejnymi ważeniami < 0.5mg'
  },

  commonIssues: [
    {
      problem: 'Niepełne spalenie (czarny popiół)',
      causes: [
        'Za krótki czas spalania',
        'Za niska temperatura',
        'Za duże fragmenty próbki',
        'Niewystarczająca cyrkulacja powietrza'
      ],
      solutions: [
        'Przedłuż czas spalania o 2 godziny',
        'Sprawdź kalibrację temperatury pieca',
        'Pokrusz próbkę na mniejsze fragmenty',
        'Sprawdź wentylację pieca'
      ]
    },
    {
      problem: 'Duże różnice między próbkami',
      causes: [
        'Nierównomierne rozdrobnienie',
        'Różne masy próbek',
        'Niejednorodność materiału',
        'Błędy w ważeniu'
      ],
      solutions: [
        'Lepiej wymieszaj materiał przed poborem próbek',
        'Użyj podobnych mas próbek',
        'Pobierz próbki z różnych miejsc',
        'Sprawdź kalibrację wagi'
      ]
    },
    {
      problem: 'Utrata masy tygielka',
      causes: [
        'Pęknięcie tygielka',
        'Reakcja z popiołem',
        'Za wysoka temperatura',
        'Korozja materiału tygielka'
      ],
      solutions: [
        'Sprawdź tygielki przed użyciem',
        'Użyj tygielków platynowych dla agresywnych popiołów',
        'Obniż temperaturę spalania',
        'Wymieniaj tygielki regularnie'
      ]
    }
  ],

  typicalValues: {
    'PE czysty': '< 0.1%',
    'PP czysty': '< 0.1%',
    'PE z wypełniaczem': '5-40%',
    'PP z talkiem': '10-30%',
    'PVC z wypełniaczem': '15-50%',
    'Kompozyty szklane': '20-60%',
    'Materiały z CaCO₃': '10-40%',
    'Farby i powłoki': '5-30%'
  },

  references: [
    'ISO 3451-1:2019 - Plastics - Determination of ash - Part 1: General methods',
    'ISO 3451-4:2019 - Part 4: Polyamides',
    'ASTM D5630-19 - Standard Test Method for Ash Content in Plastics',
    'ASTM D2584-18 - Standard Test Method for Ignition Loss of Cured Reinforced Resins'
  ]
};
