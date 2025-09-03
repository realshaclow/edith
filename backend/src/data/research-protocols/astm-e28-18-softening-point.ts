export const astmE28Protocol = {
  id: 'astm-e28-18',
  title: 'ASTM E28-18 - Temperatura Mięknienia Metodą Pierścienia i Kuli',
  description: 'Standardowa procedura określania temperatury mięknienia bitumów, asfaltów, żywic i innych materiałów metodą pierścienia i kuli.',
  category: 'thermal',
  estimatedDuration: '90-120 minut na próbkę',
  difficulty: 'intermediate',
  
  overview: {
    purpose: 'Określenie temperatury przy której materiał osiąga określoną konsystencję, wyrażoną przez przejście stalowej kuli przez próbkę pod własnym ciężarem.',
    scope: 'Stosowane do bitumów, asfaltów, żywic, parafin, tworzyw termoplastycznych i innych materiałów o właściwościach termoplastycznych.',
    principles: 'Próbka jest umieszczona w pierścieniu i podgrzewana w łaźni wodnej z kontrolowaną szybkością, a temperatura jest mierzona gdy stalowa kula przebije próbkę.',
    standards: ['ASTM E28-18', 'ISO 4625', 'EN 1427', 'AASHTO T53']
  },

  equipment: [
    { name: 'Aparat Pierścień-Kula', specification: 'Zgodny z ASTM E28 ze wspornikami i prowadnicami' },
    { name: 'Łaźnia Wodna', specification: 'Kontrola temperatury ±0.5°C, zakres 0-200°C' },
    { name: 'Termometr', specification: 'Dokładność ±0.2°C, zakres 0-200°C' },
    { name: 'Pierścienie Mosiężne', specification: 'Średnica wewnętrzna 15.875mm, wysokość 6.35mm' },
    { name: 'Kulki Stalowe', specification: 'Średnica 9.53mm, masa 3.5±0.05g' },
    { name: 'Podstawki', specification: 'Mosiężne, z otworami do pierścieni' },
    { name: 'Mieszadło', specification: 'Do mieszania łaźni wodnej' },
    { name: 'Stoper', specification: 'Dokładność ±0.1 sekundy' }
  ],

  materials: [
    'Próbki testowe (materiał do badania)',
    'Woda destylowana (do łaźni)',
    'Gliceryna (dla temperatur >100°C)',
    'Smar silikonowy (do przygotowania pierścieni)',
    'Aceton lub eter (do czyszczenia)',
    'Rękawice termiczne',
    'Ściereczki laboratoyjne'
  ],

  safetyGuidelines: [
    'Noś rękawice termiczne przy pracy z gorącymi materiałami',
    'Uważaj na gorące powierzchnie i ciecze',
    'Pracuj w dobrze wentylowanym pomieszczeniu',
    'Sprawdź stabilność ustawienia aparatu',
    'Nie dotykaj rozgrzanych próbek bezpośrednio',
    'Zachowaj ostrożność przy użyciu rozpuszczalników',
    'Przygotuj środki pierwszej pomocy na oparzenia'
  ],

  testConditions: {
    temperature: 'Start 5°C poniżej oczekiwanej temperatury mięknienia',
    heatingRate: '5±0.5°C na minutę',
    immersionDepth: '25mm poniżej powierzchni cieczy',
    ballDistance: '25mm między kulkami a dnem naczynia na początku',
    conditioning: 'Próbki w temperaturze pokojowej minimum 1 godzina',
    testMedium: 'Woda destylowana (do 100°C) lub gliceryna (powyżej 100°C)'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Próbek',
      description: 'Przygotuj próbki w pierścieniach mosiężnych',
      duration: '30 minut',
      instructions: [
        'Wyczyść pierścienie acetonem i wysusz',
        'Umieść pierścienie na płaskiej, posmarowanej powierzchni',
        'Rozgrzej materiał do temperatury płynnej (nie przegrzewaj)',
        'Wlej materiał do pierścieni z lekkim nadmiarem',
        'Usuń nadmiar materiału po ostygnięciu',
        'Sprawdź czy powierzchnia jest płaska i gładka'
      ],
      tips: [
        'Materiał powinien całkowicie wypełnić pierścień',
        'Unikaj powstawania pęcherzy powietrza',
        'Powierzchnia próbki musi być idealnie płaska'
      ],
      safety: [
        'Noś rękawice przy pracy z rozgrzanym materiałem',
        'Uważaj na gorące powierzchnie',
        'Zapewnij dobrą wentylację podczas rozgrzewania'
      ]
    },
    {
      id: 'prep-2',
      title: 'Przygotowanie Łaźni',
      description: 'Przygotuj łaźnię wodną do badania',
      duration: '20 minut',
      instructions: [
        'Napełnij naczynie łaźni wodną destylowaną',
        'Ustaw temperaturę startową 5°C poniżej oczekiwanej',
        'Zainstaluj termometr w odległości 13mm od próbek',
        'Umieść mieszadło zapewniające równomierną temperaturę',
        'Sprawdź czy termometr jest skalibrowany',
        'Odczekaj na stabilizację temperatury'
      ],
      tips: [
        'Poziom wody powinien być 25mm powyżej próbek',
        'Mieszanie powinno być delikatne ale skuteczne',
        'Dla temperatur >100°C używaj gliceryny'
      ],
      safety: [
        'Sprawdź stabilność naczynia na grzałce',
        'Upewnij się o sprawności układu grzewczego',
        'Przygotuj środki gaśnicze'
      ]
    },
    {
      id: 'test-1',
      title: 'Montaż Aparatu',
      description: 'Zamontuj próbki w aparacie badawczym',
      duration: '10 minut',
      instructions: [
        'Umieść podstawki z pierścieniami w łaźni',
        'Sprawdź czy pierścienie są poziomo',
        'Zamocuj prowadnice nad próbkami',
        'Umieść kulki stalowe w prowadnicach',
        'Sprawdź czy kulki są centrowane nad próbkami',
        'Ustaw wysokość kulek 25mm nad dnem naczynia'
      ],
      tips: [
        'Kulki muszą być dokładnie wycentrowane',
        'Sprawdź czy wszystkie elementy są stabilne',
        'Prowadnice nie mogą przeszkadzać w ruchu kulek'
      ],
      safety: [
        'Uważaj na gorącą wodę przy montażu',
        'Sprawdź stabilność całego układu',
        'Nie dotykaj elementów metalowych w łaźni'
      ]
    },
    {
      id: 'test-2',
      title: 'Przeprowadzenie Badania',
      description: 'Wykonaj test temperatury mięknienia',
      duration: '45 minut',
      instructions: [
        'Uruchom grzewanie z szybkością 5°C/min',
        'Obserwuj próbki przez cały czas badania',
        'Zapisuj temperaturę co 1°C wzrostu',
        'Notuj moment gdy kulka dotyka dna naczynia',
        'Zapisz temperaturę mięknienia dla każdej próbki',
        'Kontynuuj do przebicia wszystkich próbek'
      ],
      tips: [
        'Kulka powinna przebić próbkę i opaść o 25mm',
        'Temperatura mięknienia = moment przebicia',
        'Obserwuj obie próbki równocześnie'
      ],
      safety: [
        'Nie zostawiaj aparatu bez nadzoru',
        'Sprawdzaj temperaturę regularnie',
        'Bądź gotowy do wyłączenia grzania'
      ]
    },
    {
      id: 'analysis-1',
      title: 'Analiza Wyników',
      description: 'Oblicz średnią temperaturę mięknienia',
      duration: '10 minut',
      instructions: [
        'Zapisz temperatury mięknienia obu próbek',
        'Sprawdź czy różnica między próbkami ≤ 1°C',
        'Oblicz średnią z dwóch pomiarów',
        'Jeśli różnica >1°C - powtórz badanie',
        'Porównaj wynik z danymi literaturowymi',
        'Zapisz końcowy wynik z niepewnością'
      ],
      tips: [
        'Dobra powtarzalność to ±0.5°C',
        'Sprawdź czy wynik jest logiczny dla materiału',
        'Dokumentuj wszelkie anomalie'
      ],
      safety: [
        'Poczekaj na ostygnięcie przed czyszczeniem',
        'Usuń gorące próbki ostrożnie',
        'Wyłącz grzanie i wentylację'
      ]
    },
    {
      id: 'cleanup-1',
      title: 'Czyszczenie Aparatury',
      description: 'Wyczyść aparat po zakończeniu badania',
      duration: '15 minut',
      instructions: [
        'Poczekaj na całkowite ostygnięcie aparatu',
        'Usuń próbki z pierścieni za pomocą rozpuszczalnika',
        'Wyczyść pierścienie i kulki acetonem',
        'Wypłucz łaźnię i wysusz wszystkie elementy',
        'Sprawdź czy pierścienie nie są uszkodzone',
        'Przechowuj aparat w suchym miejscu'
      ],
      tips: [
        'Nie używaj ostrych narzędzi do usuwania próbek',
        'Sprawdź czy wszystkie elementy są czyste',
        'Kontroluj stan kulek stalowych'
      ],
      safety: [
        'Noś rękawice przy użyciu rozpuszczalników',
        'Zapewnij wentylację podczas czyszczenia',
        'Sprawdź czy wszystko jest suche przed przechowaniem'
      ]
    }
  ],

  calculations: {
    softeningPoint: 'T_mięknienia = (T₁ + T₂) / 2 [°C]',
    uncertainty: 'Niepewność = |T₁ - T₂| / 2 [°C]',
    repeatability: 'Różnica między próbkami ≤ 1.0°C',
    where: {
      'T₁': 'temperatura mięknienia próbki 1 [°C]',
      'T₂': 'temperatura mięknienia próbki 2 [°C]',
      'T_mięknienia': 'średnia temperatura mięknienia [°C]'
    }
  },

  acceptanceCriteria: {
    sampleNumber: 'Minimum 2 próbki na materiał',
    repeatability: 'Różnica między próbkami ≤ 1.0°C',
    heatingRate: '5.0±0.5°C na minutę',
    temperatureAccuracy: '±0.2°C dokładność pomiaru',
    ballPosition: 'Kulki wycentrowane z dokładnością ±1mm'
  },

  commonIssues: [
    {
      problem: 'Nierównomierne przebicie próbek',
      causes: [
        'Nierównomierna grubość próbki',
        'Pęcherze powietrza w materiale',
        'Źle wycentrowana kulka',
        'Nierównomierne grzanie'
      ],
      solutions: [
        'Sprawdź płaskość powierzchni próbki',
        'Unikaj powstawania pęcherzy przy przygotowaniu',
        'Dokładnie wycentruj kulki',
        'Zapewnij równomierne mieszanie łaźni'
      ]
    },
    {
      problem: 'Duża różnica między próbkami',
      causes: [
        'Niejednorodność materiału',
        'Różne grubości próbek',
        'Błędy w przygotowaniu',
        'Zanieczyszczenia'
      ],
      solutions: [
        'Lepiej wymieszaj materiał przed badaniem',
        'Kontroluj grubość próbek',
        'Sprawdź procedurę przygotowania',
        'Użyj czystszych próbek'
      ]
    },
    {
      problem: 'Próbka nie zostaje przebita',
      causes: [
        'Za mała temperatura końcowa',
        'Za szybkie grzanie',
        'Materiał bardzo twardy',
        'Błędny typ kulki'
      ],
      solutions: [
        'Kontynuuj grzanie do wyższej temperatury',
        'Zmniejsz szybkość grzania',
        'Sprawdź specyfikację materiału',
        'Sprawdź masę i wymiary kulki'
      ]
    }
  ],

  typicalValues: {
    'Asfalt drogowy': '45-60°C',
    'Bitum przemysłowy': '35-50°C',
    'Żywica sosna': '70-80°C',
    'Parafina': '50-65°C',
    'Wosk pszczeli': '61-65°C',
    'Asfalt modyfikowany': '55-80°C',
    'Masa asfaltowa': '40-55°C',
    'Żywica epoksydowa': '85-120°C'
  },

  references: [
    'ASTM E28-18 - Standard Test Methods for Softening Point of Resins Derived from Pine Chemicals',
    'ISO 4625:2016 - Binders for paints and varnishes - Softening point - Ring-and-ball method',
    'EN 1427:2015 - Bitumen and bituminous binders - Determination of the softening point',
    'AASHTO T53-19 - Standard Method of Test for Softening Point of Bitumen'
  ]
};
