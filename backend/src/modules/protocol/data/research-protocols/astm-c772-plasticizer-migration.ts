export const astmC772Protocol = {
  id: 'astm-c772',
  title: 'ASTM C772 - Migracja Plastyfikatorów',
  description: 'Standardowy protokół do badania migracji plastyfikatorów z materiałów polimerowych do otaczającego środowiska.',
  category: 'CHEMICAL',
  estimatedDuration: '7-14 dni (w zależności od okresu ekspozycji)',
  difficulty: 'INTERMEDIATE',
  
  overview: {
    purpose: 'Określenie skłonności plastyfikatorów do migracji z materiałów polimerowych przy podwyższonej temperaturze.',
    scope: 'Stosowane do materiałów zawierających plastyfikatory, szczególnie PVC, elastomerów i uszczelniaczy.',
    principles: 'Próbka jest poddawana działaniu podwyższonej temperatury w kontakcie z materiałem absorbującym, który pochłania migrujący plastyfikator.',
    standards: ['ASTM C772-18', 'ISO 176', 'DIN 53770']
  },

  equipment: [
    { name: 'Suszarka Laboratoryjna', specification: 'Kontrola temperatury ±2°C, wentylacja naturalna' },
    { name: 'Waga Analityczna', specification: 'Dokładność ±0.1mg' },
    { name: 'Eksykator', specification: 'Z żelem krzemionkowym' },
    { name: 'Naczynia Szklane', specification: 'Płaskie naczynia o odpowiedniej wielkości' },
    { name: 'Materiał Absorbujący', specification: 'Węgiel aktywny, żel krzemionkowy lub papier filtracyjny' },
    { name: 'Termometr', specification: 'Dokładność ±1°C' },
    { name: 'Pęseta', specification: 'Do manipulacji próbkami' },
    { name: 'Suwmiarka', specification: 'Do pomiaru wymiarów próbek' }
  ],

  materials: [
    'Próbki testowe (wymiary 50x50x2mm)',
    'Materiał absorbujący (węgiel aktywny, żel krzemionkowy)',
    'Papier filtracyjny',
    'Rękawice laboratoryjne',
    'Etykiety do oznaczania próbek'
  ],

  safetyGuidelines: [
    'Noś rękawice podczas manipulacji próbkami',
    'Pracuj w dobrze wentylowanym pomieszczeniu',
    'Uważaj na gorące powierzchnie suszarki',
    'Używaj okularów ochronnych przy pracy z chemikaliami',
    'Sprawdź właściwości bezpieczeństwa plastyfikatorów'
  ],

  testConditions: {
    temperature: '70±2°C (standardowa) lub 80°C, 100°C dla materiałów termoodpornych',
    exposureTime: '24h, 168h (7 dni) lub 336h (14 dni)',
    atmosphere: 'Powietrze laboratoryjne z naturalną konwekcją',
    sampleSize: '50±1mm x 50±1mm x grubość nominalna',
    conditioning: 'Kondycjonowanie w standardowych warunkach przed testem'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Próbek',
      description: 'Przygotuj próbki testowe do badania migracji',
      duration: '30 minut',
      instructions: [
        'Wytnij próbki o wymiarach 50x50mm',
        'Zmierz dokładne wymiary każdej próbki',
        'Oznacz próbki numerami trwałymi znacznikami',
        'Sprawdź powierzchnie pod kątem uszkodzeń',
        'Usuń ewentualne zanieczyszczenia',
        'Zważ każdą próbkę z dokładnością ±0.1mg'
      ],
      tips: [
        'Próbki powinny mieć równe, gładkie krawędzie',
        'Unikaj dotykania powierzchni próbek palcami',
        'Przechowuj próbki w czystym miejscu'
      ],
      safety: [
        'Używaj rękawic podczas manipulacji',
        'Ostrożnie obchodź się z ostrymi narzędziami',
        'Unikaj wdychania pyłu z cięcia'
      ]
    },
    {
      id: 'prep-2',
      title: 'Przygotowanie Materiału Absorbującego',
      description: 'Przygotuj system absorbujący plastyfikator',
      duration: '20 minut',
      instructions: [
        'Wybierz odpowiedni materiał absorbujący',
        'Zważ potrzebną ilość materiału (około 5g na próbkę)',
        'Umieść materiał w płaskim naczyniu',
        'Rozprowadź równomiernie po powierzchni',
        'Przygotuj osobne naczynia dla każdej próbki',
        'Oznacz naczynia numerami próbek'
      ],
      tips: [
        'Węgiel aktywny jest najbardziej skuteczny',
        'Materiał powinien całkowicie pokrywać dno naczynia',
        'Grubość warstwy około 2-3mm'
      ],
      safety: [
        'Unikaj wdychania pyłu z węgla aktywnego',
        'Pracuj w dobrze wentylowanym miejscu',
        'Używaj maseczki przeciwpyłowej'
      ]
    },
    {
      id: 'setup-1',
      title: 'Montaż Układu Testowego',
      description: 'Umieść próbki w kontakcie z materiałem absorbującym',
      duration: '15 minut',
      instructions: [
        'Umieść próbkę powierzchnią testową na materiale absorbującym',
        'Upewnij się o pełnym kontakcie powierzchni',
        'Nie dociskaj próbki - powinien być luźny kontakt',
        'Sprawdź czy materiał absorbujący nie wykracza poza próbkę',
        'Umieść układy w suszarce w temperaturze testowej',
        'Zapisz dokładny czas rozpoczęcia testu'
      ],
      tips: [
        'Powierzchnia kontaktu powinna być równa',
        'Unikaj pęcherzy powietrza pod próbką',
        'Pozostaw przestrzeń między naczyniami w suszarce'
      ],
      safety: [
        'Uważaj na gorące powierzchnie suszarki',
        'Sprawdź czy temperatura jest stabilna',
        'Upewnij się o właściwej wentylacji'
      ]
    },
    {
      id: 'test-1',
      title: 'Ekspozycja w Temperaturze',
      description: 'Przeprowadź ekspozycję przez określony czas',
      duration: '24h - 14 dni (zależnie od procedury)',
      instructions: [
        'Utrzymuj stałą temperaturę ±2°C',
        'Sprawdzaj temperaturę co najmniej raz dziennie',
        'Nie otwieraj suszarki częściej niż to konieczne',
        'Prowadź dziennik temperatury',
        'Obserwuj ewentualne zmiany wizualne',
        'Po zakończeniu ekspozycji schłodź próbki w eksykatorze'
      ],
      tips: [
        'Długość ekspozycji zależy od typu materiału',
        'Dla materiałów miękkych wystarczy 24h',
        'Materiały sztywne mogą wymagać 7-14 dni'
      ],
      safety: [
        'Sprawdzaj regularnie działanie suszarki',
        'Upewnij się o bezpieczeństwie elektrycznym',
        'Monitoruj ewentualne wydzielanie par'
      ]
    },
    {
      id: 'calc-1',
      title: 'Pomiary i Obliczenia',
      description: 'Wykonaj pomiary końcowe i oblicz migrację',
      duration: '30 minut',
      instructions: [
        'Schłodź próbki do temperatury pokojowej',
        'Zważ próbki po ekspozycji',
        'Oblicz ubytek masy: Δm = (m₀ - m₁)/m₀ × 100%',
        'Zmierz ewentualne zmiany wymiarów',
        'Oceń zmiany wizualne (kolor, powierzchnia)',
        'Sprawdź elastyczność/twardość materiału'
      ],
      tips: [
        'Próbki muszą być całkowicie suche przed ważeniem',
        'Wykonaj pomiary możliwie szybko',
        'Fotografuj ewentualne zmiany wizualne'
      ],
      safety: [
        'Używaj rękawic podczas manipulacji',
        'Unikaj wdychania oparów'
      ]
    }
  ],

  calculations: {
    massLoss: 'Ubytek masy (%) = (m₀ - m₁)/m₀ × 100',
    migrationRate: 'Szybkość migracji = Ubytek masy / czas ekspozycji',
    where: {
      'm₀': 'masa początkowa próbki [g]',
      'm₁': 'masa końcowa próbki [g]',
      'czas': 'czas ekspozycji [h lub dni]'
    }
  },

  acceptanceCriteria: {
    repeatability: 'Różnica między pomiarami < 10% wartości średniej',
    minimumSamples: 'Minimum 3 próbki na warunki testowe',
    validTest: 'Brak uszkodzeń mechanicznych próbki',
    temperatureStability: 'Temperatura stabilna ±2°C podczas całego testu'
  },

  commonIssues: [
    {
      problem: 'Bardzo duży ubytek masy',
      causes: [
        'Za wysoka temperatura testu',
        'Za długi czas ekspozycji',
        'Materiał niestabilny termicznie',
        'Duża zawartość plastyfikatora'
      ],
      solutions: [
        'Obniż temperaturę testu',
        'Skróć czas ekspozycji',
        'Sprawdź skład materiału',
        'Użyj materiału referencyjnego'
      ]
    },
    {
      problem: 'Brak mierzalnej migracji',
      causes: [
        'Za niska temperatura',
        'Za krótki czas ekspozycji',
        'Materiał bez plastyfikatora',
        'Nieaktywny materiał absorbujący'
      ],
      solutions: [
        'Zwiększ temperaturę w dopuszczalnym zakresie',
        'Przedłuż czas ekspozycji',
        'Sprawdź skład materiału',
        'Wymień materiał absorbujący'
      ]
    },
    {
      problem: 'Niepowtarzalne wyniki',
      causes: [
        'Niejednorodność próbek',
        'Niestabilna temperatura',
        'Różny kontakt z materiałem absorbującym',
        'Zanieczyszczenia próbek'
      ],
      solutions: [
        'Sprawdź jednorodność materiału',
        'Popraw kontrolę temperatury',
        'Zapewnij równomierny kontakt',
        'Oczyść próbki przed testem'
      ]
    }
  ],

  typicalValues: {
    'PVC miękki': 'Ubytek masy: 2-15% (24h/70°C)',
    'PVC sztywny': 'Ubytek masy: 0.1-2% (168h/70°C)',
    'Poliuretan': 'Ubytek masy: 1-8% (168h/70°C)',
    'Elastomery': 'Ubytek masy: 0.5-5% (168h/70°C)',
    'Uszczelniacze': 'Ubytek masy: 3-20% (168h/70°C)'
  },

  references: [
    'ASTM C772-18 - Standard Test Method for Weight Loss of Plasticizers from Plastic Compositions',
    'ISO 176:2005 - Plastics - Determination of loss of plasticizers - Activated carbon method',
    'DIN 53770 - Testing of plastics and elastomers - Determination of loss of plasticizers'
  ]
};
