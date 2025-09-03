export const iso11357Protocol = {
  id: 'iso-11357',
  title: 'ISO 11357 - Różnicowa Kalorymetria Skaningowa (DSC)',
  description: 'Kompleksowy protokół analizy termicznej plastików metodą DSC do określania temperatury topnienia, krystalizacji, temperatury zeszklenia i entalpii przemian fazowych.',
  category: 'thermal',
  estimatedDuration: '60-90 minut na próbkę',
  difficulty: 'intermediate',
  
  overview: {
    purpose: 'Charakteryzacja właściwości termicznych plastików poprzez pomiar strumienia ciepła w funkcji temperatury lub czasu.',
    scope: 'Stosowane do badania przejść fazowych, reaktywności, stabilności termicznej i kinetyki procesów termicznych.',
    principles: 'Pomiar różnicy w strumieniu ciepła między próbką a materiałem referencyjnym podczas kontrolowanego programu temperaturowego.',
    standards: ['ISO 11357-1:2016', 'ISO 11357-3:2018', 'ASTM D3418', 'ASTM E1356']
  },

  equipment: [
    { name: 'Kalorymetr DSC', specification: 'Dokładność ±0.1°C, zakres -50°C do +400°C' },
    { name: 'Tygielki DSC', specification: 'Aluminiowe lub platynowe, z pokrywkami' },
    { name: 'Prasa do Tygielków', specification: 'Do szczelnego zamykania tygielków' },
    { name: 'Waga Analityczna', specification: 'Dokładność ±0.01mg' },
    { name: 'Substancje Wzorcowe', specification: 'Ind, cynk, ołów do kalibracji' },
    { name: 'Gaz Ochronny', specification: 'Azot o czystości 99.9%' },
    { name: 'Nożyk lub Skalpel', specification: 'Do przygotowania próbek' },
    { name: 'Pęseta', specification: 'Do manipulacji tygielków' }
  ],

  materials: [
    'Próbki testowe (2-10mg)',
    'Tygielki aluminiowe z pokrywkami',
    'Gazowy azot',
    'Materiały wzorcowe do kalibracji',
    'Rękawice laboratoryjne',
    'Papier do czyszczenia optyki'
  ],

  safetyGuidelines: [
    'Pracuj w dobrze wentylowanym pomieszczeniu',
    'Noś rękawice przy manipulacji próbkami',
    'Nie otwieraj kalorymetru podczas pracy',
    'Sprawdź ciśnienie gazu ochronnego',
    'Uważaj na gorące powierzchnie po zakończeniu analizy',
    'Nie dotykaj elementów grzejnych'
  ],

  testConditions: {
    temperature: 'Zgodnie z programem temperaturowym',
    atmosphere: 'Azot, przepływ 20-50 ml/min',
    sampleMass: '2-10 mg (optymalne 5-8 mg)',
    heatingRate: '10°C/min (standardowo)',
    temperatureRange: 'Zależnie od materiału (-50°C do +300°C)',
    conditioning: 'Próbki przechowywane w suchym miejscu'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Aparatury',
      description: 'Przygotuj kalorymetr DSC do pomiaru',
      duration: '20 minut',
      instructions: [
        'Sprawdź połączenie gazu ochronnego',
        'Ustaw przepływ azotu na 30-50 ml/min',
        'Uruchom kalorymetr i odczekaj na stabilizację',
        'Przeprowadź kalibrację temperatury z użyciem wzorców',
        'Sprawdź czystość wnętrza kalorymetru',
        'Wyczyść podstawki pod tygielki'
      ],
      tips: [
        'Kalibracja powinna być wykonana dla zakres temperatury badania',
        'Używaj wzorców o wysokiej czystości',
        'Sprawdź czy nie ma pozostałości po poprzednich pomiarach'
      ],
      safety: [
        'Nie dotykaj gorących elementów',
        'Sprawdź szczelność instalacji gazowej',
        'Upewnij się o dobrej wentylacji'
      ]
    },
    {
      id: 'prep-2',
      title: 'Przygotowanie Próbek',
      description: 'Przygotuj próbki do analizy DSC',
      duration: '15 minut',
      instructions: [
        'Wytnij próbkę o masie 5-8 mg',
        'Zważ dokładnie próbkę',
        'Umieść próbkę w tygielku DSC',
        'Zamknij tygielek pokrywką i zgniecij krawędzie',
        'Sprawdź szczelność zamknięcia',
        'Przygotuj pusty tygielek referencyjny'
      ],
      tips: [
        'Próbka powinna mieć dobry kontakt z dnem tygielka',
        'Unikaj za dużych próbek - mogą dać nieprawidłowe wyniki',
        'Tygielek referencyjny musi być identyczny'
      ],
      safety: [
        'Używaj pęsety do manipulacji tygielków',
        'Unikaj uszkodzeń ostrymi narzędziami',
        'Noś rękawice'
      ]
    },
    {
      id: 'test-1',
      title: 'Pierwszy Cykl Grzania',
      description: 'Wykonaj pierwszy cykl grzania próbki',
      duration: '30 minut',
      instructions: [
        'Umieść tygielki w kalorymetrze (próbka i referencja)',
        'Zamknij kalorymetr',
        'Ustaw program temperaturowy: 25°C → Tmax (10°C/min)',
        'Uruchom pomiar',
        'Monitoruj przebieg krzywej DSC',
        'Zapisz wyniki po zakończeniu cyklu'
      ],
      tips: [
        'Pierwsz cykl usuwa historię termiczną materiału',
        'Obserwuj charakterystyczne piki na krzywej',
        'Notuj temperatury początku i końca przemian'
      ],
      safety: [
        'Nie otwieraj kalorymetru podczas pomiaru',
        'Sprawdzaj ciśnienie gazu podczas długich pomiarów'
      ]
    },
    {
      id: 'test-2',
      title: 'Cykl Chłodzenia',
      description: 'Schłodź próbkę z kontrolowaną szybkością',
      duration: '20 minut',
      instructions: [
        'Ustaw program chłodzenia: Tmax → 25°C (10°C/min)',
        'Uruchom cykl chłodzenia',
        'Monitoruj proces krystalizacji',
        'Zapisz temperaturę krystalizacji',
        'Oblicz entalpia krystalizacji',
        'Sprawdź czy próbka całkowicie skrystalizowała'
      ],
      tips: [
        'Krystalizacja może rozpocząć się z opóźnieniem',
        'Niektóre materiały krystalizują bardzo powoli',
        'Notuj kształt piku krystalizacji'
      ],
      safety: [
        'Nie przyspieszaj chłodzenia - może uszkodzić próbkę',
        'Sprawdzaj przepływ gazu'
      ]
    },
    {
      id: 'test-3',
      title: 'Drugi Cykl Grzania',
      description: 'Wykonaj drugi cykl grzania dla reprezentatywnych wyników',
      duration: '30 minut',
      instructions: [
        'Ustaw identyczny program jak w pierwszym cyklu',
        'Uruchom drugi cykl grzania',
        'Zapisz temperaturę topnienia (Tm)',
        'Oblicz entalpię topnienia (ΔHm)',
        'Określ temperaturę zeszklenia (Tg) jeśli występuje',
        'Sprawdź powtarzalność wyników'
      ],
      tips: [
        'Drugi cykl daje właściwości materiału bez naprężeń',
        'Porównaj wyniki z pierwszym cyklem',
        'Tg jest widoczna jako zmiana linii bazowej'
      ],
      safety: [
        'Kontynuuj monitorowanie przepływu gazu',
        'Sprawdź stabilność temperatury'
      ]
    },
    {
      id: 'analysis-1',
      title: 'Analiza Wyników',
      description: 'Przeprowadź analizę krzywych DSC',
      duration: '20 minut',
      instructions: [
        'Wyznacz temperaturę topnienia (maksimum piku)',
        'Oblicz entalpię topnienia (pole pod pikiem)',
        'Określ temperaturę zeszklenia (punkt przegięcia)',
        'Oblicz stopień krystaliczności',
        'Porównaj wyniki z danymi literaturowymi',
        'Oceń jakość próbki'
      ],
      tips: [
        'Używaj oprogramowania kalorymetru do obliczeń',
        'Sprawdź poprawność wyznaczenia linii bazowej',
        'Porównaj z próbkami wzorcowymi'
      ],
      safety: []
    }
  ],

  calculations: {
    meltingPoint: 'Tm = temperatura maksimum piku topnienia [°C]',
    meltingEnthalpy: 'ΔHm = pole pod pikiem topnienia [J/g]',
    crystallinity: 'χc = (ΔHm/ΔHm°) × 100% [%]',
    glassTransition: 'Tg = temperatura punktu przegięcia [°C]',
    crystallizationTemp: 'Tc = temperatura maksimum piku krystalizacji [°C]',
    where: {
      'ΔHm°': 'entalpia topnienia materiału 100% krystalicznego [J/g]',
      'χc': 'stopień krystaliczności [%]',
      'Tm': 'temperatura topnienia [°C]',
      'Tg': 'temperatura zeszklenia [°C]'
    }
  },

  acceptanceCriteria: {
    sampleMass: '5-8 mg dla optymalnej czułości',
    temperatureAccuracy: '±0.5°C dla temperatury topnienia',
    enthalpyPrecision: '±2% dla entalpii topnienia',
    repeatability: 'RSD < 2% dla temperatury topnienia',
    baselineStability: 'Dryft < 0.1 mW podczas pomiaru'
  },

  commonIssues: [
    {
      problem: 'Szerokie piki topnienia',
      causes: [
        'Za duża próbka',
        'Słaby kontakt termiczny',
        'Nierównomierna próbka',
        'Za szybka szybkość grzania'
      ],
      solutions: [
        'Zmniejsz masę próbki do 5mg',
        'Popraw kontakt z dnem tygielka',
        'Pokrusz próbkę na mniejsze fragmenty',
        'Zmniejsz szybkość grzania do 5°C/min'
      ]
    },
    {
      problem: 'Niestabilna linia bazowa',
      causes: [
        'Zanieczyszczenia w kalorymetrze',
        'Nieszczełny tygielek',
        'Problemy z gazem ochronnym',
        'Różnice mas między próbką a referencją'
      ],
      solutions: [
        'Wyczyść wnętrze kalorymetru',
        'Sprawdź zamknięcie tygielka',
        'Kontroluj przepływ azotu',
        'Użyj podobnych mas dla próbki i referencji'
      ]
    },
    {
      problem: 'Brak piku krystalizacji',
      causes: [
        'Za szybkie chłodzenie',
        'Materiał amorficzny',
        'Za wysoka temperatura topnienia',
        'Obecność nukleatorów'
      ],
      solutions: [
        'Zmniejsz szybkość chłodzenia',
        'Sprawdź czy materiał krystalizuje',
        'Zastosuj izotermiczną krystalizację',
        'Porównaj z próbkami czystymi'
      ]
    }
  ],

  typicalValues: {
    'PE-LD': 'Tm: 105-115°C, ΔHm: 80-100 J/g',
    'PE-HD': 'Tm: 125-135°C, ΔHm: 120-150 J/g',
    'PP': 'Tm: 160-170°C, ΔHm: 80-120 J/g',
    'PET': 'Tm: 250-260°C, Tg: 70-80°C',
    'PS': 'Tg: 95-105°C (amorficzny)',
    'PC': 'Tg: 140-150°C (amorficzny)',
    'PMMA': 'Tg: 100-110°C (amorficzny)',
    'PA6': 'Tm: 215-225°C, ΔHm: 150-190 J/g'
  },

  references: [
    'ISO 11357-1:2016 - Plastics - Differential scanning calorimetry (DSC) - Part 1: General principles',
    'ISO 11357-3:2018 - Part 3: Determination of temperature and enthalpy of melting and crystallization',
    'ASTM D3418-21 - Standard Test Method for Transition Temperatures and Enthalpies of Fusion and Crystallization',
    'ASTM E1356-08 - Standard Test Method for Assignment of the Glass Transition Temperatures by DSC'
  ]
};
