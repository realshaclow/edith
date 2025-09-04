export const iso289Protocol = {
  id: 'iso-289',
  title: 'ISO 289 - Lepkość Mooneya Kauczuków',
  description: 'Standardowy protokół do określania lepkości Mooneya kauczuków surowych i mieszanek gumowych.',
  category: 'RHEOLOGICAL',
  estimatedDuration: '20-30 minut na próbkę',
  difficulty: 'INTERMEDIATE',
  
  overview: {
    purpose: 'Określenie lepkości Mooney\'a jako miary konsystencji i przetwarzalności surowej gumy i mieszanek gumowych.',
    scope: 'Stosowane do surowej gumy naturalnej i syntetycznej oraz mieszanek gumowych nieutwardzonych.',
    principles: 'Lepkość jest mierzona jako moment obrotowy potrzebny do obrócenia standardowego rotora w próbce gumy w określonej temperaturze.',
    standards: ['ISO 289-1:2014', 'ASTM D1646', 'DIN 53523']
  },

  equipment: [
    { name: 'Wiskozymetr Mooney\'a', specification: 'Zgodny z ISO 289, kontrola temperatury ±0.5°C' },
    { name: 'Rotor Standardowy', specification: 'Typ L (średnica 38.1mm) lub S (średnica 30.5mm)' },
    { name: 'Komora Testowa', specification: 'Średnica 50.8mm, wysokość 24.6mm' },
    { name: 'System Grzejny', specification: 'Temperatura 100±0.5°C lub 125±0.5°C' },
    { name: 'Rejestrator Momentu', specification: 'Zakres 0-200 jednostek Mooney\'a' },
    { name: 'Waga', specification: 'Dokładność ±0.1g' },
    { name: 'Nóż do Cięcia', specification: 'Ostry nóż do przygotowania próbek' },
    { name: 'Kalander/Wałki', specification: 'Do przygotowania arkuszy gumy' }
  ],

  materials: [
    'Próbka gumy (około 25g)',
    'Folia separacyjna (polyester lub celofan)',
    'Środek antyadhezyjny (talk, kreda)',
    'Rękawice nitrylowe',
    'Narzędzia do manipulacji próbką'
  ],

  safetyGuidelines: [
    'Noś rękawice podczas pracy z gorącymi powierzchniami',
    'Uważaj na ruchome części rotora',
    'Używaj okularów ochronnych podczas cięcia próbek',
    'Upewnij się o właściwej wentylacji pomieszczenia',
    'Sprawdź zabezpieczenia przed przeciążeniem'
  ],

  testConditions: {
    temperature: '100±0.5°C (standardowa) lub 125±0.5°C (dla niektórych materiałów)',
    preheating: '1 minuta przed rozpoczęciem rotacji',
    testDuration: '4 minuty rotacji po preheating',
    rotorSpeed: '2±0.02 rpm',
    environment: 'Standardowa atmosfera laboratoryjna'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Sprzętu',
      description: 'Przygotuj wiskozymetr i sprawdź kalibrację',
      duration: '10-15 minut',
      instructions: [
        'Sprawdź czystość komory testowej i rotora',
        'Ustaw temperaturę testową (100°C lub 125°C)',
        'Sprawdź kalibrację momentu obrotowego',
        'Sprawdź prędkość rotacji rotora (2 rpm)',
        'Upewnij się że system jest stabilny termicznie',
        'Przeprowadź test kalibracyjny z materiałem referencyjnym'
      ],
      tips: [
        'Komora musi być całkowicie czysta - resztki gumy wpływają na wyniki',
        'Temperatura powinna być stabilna przez co najmniej 30 minut',
        'Kalibracja powinna być sprawdzana codziennie'
      ],
      safety: [
        'Uważaj na gorące powierzchnie komory',
        'Sprawdź funkcję awaryjnego zatrzymania',
        'Upewnij się że osłony są na miejscu'
      ]
    },
    {
      id: 'prep-2',
      title: 'Przygotowanie Próbki',
      description: 'Przygotuj próbkę gumy do testu',
      duration: '10-15 minut',
      instructions: [
        'Odważ około 25g próbki gumy',
        'Przemieszaj próbkę aby zapewnić jednorodność',
        'Przygotuj arkusz o grubości 5-6mm na kalandrze',
        'Wytnie koła o średnicy nieco większej od komory',
        'Przygotuj dwie warstwy próbki',
        'Usuń pęcherze powietrza z próbki'
      ],
      tips: [
        'Próbka musi być reprezentatywna dla całej partii',
        'Unikaj przegrzania podczas przygotowania',
        'Grubość próbki powinna być jednolita'
      ],
      safety: [
        'Noś rękawice podczas pracy z kalandrem',
        'Uważaj na gorące wałki kalandra',
        'Używaj narzędzi do manipulacji próbką'
      ]
    },
    {
      id: 'setup-1',
      title: 'Ładowanie Próbki',
      description: 'Załaduj próbkę do komory wiskozymetru',
      duration: '5 minut',
      instructions: [
        'Otwórz komorę wiskozymetru',
        'Umieść dolną warstwę próbki w komorze',
        'Wstaw rotor w środek próbki',
        'Umieść górną warstwę próbki',
        'Zamknij komorę i dociśnij zgodnie ze specyfikacją',
        'Sprawdź czy próbka wypełnia całkowicie komorę'
      ],
      tips: [
        'Próbka powinna całkowicie otaczać rotor',
        'Unikaj pęcherzy powietrza w próbce',
        'Docisk powinien być równomierny'
      ],
      safety: [
        'Nie dotykaj gorącej komory bez rękawic',
        'Uważaj na pozycję rotora podczas zamykania',
        'Sprawdź czy komora jest właściwie zamknięta'
      ]
    },
    {
      id: 'test-1',
      title: 'Wykonanie Testu',
      description: 'Przeprowadź pomiar lepkości Mooney\'a',
      duration: '5-6 minut',
      instructions: [
        'Uruchom preheating na 1 minutę',
        'Po preheating rozpocznij rotację rotora',
        'Zapisuj wartości momentu co 30 sekund',
        'Kontynuuj test przez 4 minuty',
        'Odczytaj wartość lepkości po 1 i 4 minutach',
        'Zapisz wszystkie odczyty w protokole'
      ],
      tips: [
        'Moment obrotowy może być niestabilny na początku',
        'Wartość po 4 minutach jest wartością standardową',
        'Obserwuj czy są znaczne fluktuacje momentu'
      ],
      safety: [
        'Nie otwieraj komory podczas rotacji',
        'Sprawdź czy rotor obraca się swobodnie',
        'Obserwuj przeciążenia momentu'
      ]
    },
    {
      id: 'calc-1',
      title: 'Odczyt i Obliczenia',
      description: 'Odczytaj wyniki i wykonaj obliczenia',
      duration: '5 minut',
      instructions: [
        'Odczytaj wartość lepkości po 4 minutach rotacji',
        'Sprawdź trend wartości podczas testu',
        'Oblicz różnicę między wartością końcową a początkową',
        'Porównaj z wartościami referencyjnymi',
        'Sprawdź czy wynik mieści się w akceptowalnym zakresie'
      ],
      tips: [
        'Wartość powinna być stabilna pod koniec testu',
        'Duże fluktuacje mogą wskazywać na problemy',
        'Zapisz temperaturę i czas testu'
      ],
      safety: [
        'Pozwól komorze ostygnąć przed otwarciem',
        'Używaj narzędzi do usunięcia próbki'
      ]
    }
  ],

  calculations: {
    mooney: 'ML(1+4) = wartość momentu po 4 minutach rotacji [jednostki Mooney\'a]',
    scorch: 't5 = czas do wzrostu o 5 jednostek powyżej minimum [min]',
    where: {
      'ML': 'Lepkość Mooney\'a z rotorem dużym (L)',
      '1+4': '1 minuta preheating + 4 minuty test',
      't5': 'Czas scorchu (dla mieszanek)'
    }
  },

  acceptanceCriteria: {
    repeatability: 'Różnica między pomiarami < 3 jednostki Mooney\'a',
    reproducibility: 'Różnica między laboratoriami < 5 jednostek',
    minimumSamples: 'Minimum 2 pomiary na próbkę',
    temperatureStability: 'Temperatura stabilna ±0.5°C podczas testu'
  },

  commonIssues: [
    {
      problem: 'Niestabilne odczyty momentu',
      causes: [
        'Pęcherze powietrza w próbce',
        'Nierównomierna temperatura',
        'Zużyty rotor lub komora',
        'Nieodpowiednia konsystencja próbki'
      ],
      solutions: [
        'Lepiej przygotuj próbkę - usuń powietrze',
        'Sprawdź kalibrację temperatury',
        'Sprawdź stan rotora i komory',
        'Sprawdź jednorodność materiału'
      ]
    },
    {
      problem: 'Wartości poza zakresem',
      causes: [
        'Niewłaściwa temperatura testu',
        'Zanieczyszczona próbka',
        'Błędna kalibracja sprzętu',
        'Nieodpowiedni rotor'
      ],
      solutions: [
        'Sprawdź i skoryguj temperaturę',
        'Użyj czystej próbki',
        'Przeprowadź kalibrację sprzętu',
        'Sprawdź typ i stan rotora'
      ]
    },
    {
      problem: 'Przywieranie próbki do komory',
      causes: [
        'Za wysoka temperatura',
        'Brak środka antyadhezyjnego',
        'Przedłużenie gumy podczas testu',
        'Niewłaściwy materiał próbki'
      ],
      solutions: [
        'Obniż temperaturę testu',
        'Użyj odpowiedniego środka antyadhezyjnego',
        'Sprawdź właściwości próbki',
        'Skróć czas testu'
      ]
    }
  ],

  typicalValues: {
    'Guma naturalna (NR)': '60-90 ML(1+4) przy 100°C',
    'SBR': '45-70 ML(1+4) przy 100°C',
    'NBR': '40-80 ML(1+4) przy 100°C',
    'EPDM': '40-70 ML(1+4) przy 125°C',
    'Neopren': '40-90 ML(1+4) przy 100°C',
    'Mieszanki gumowe': '30-120 ML(1+4) zależnie od składu'
  },

  references: [
    'ISO 289-1:2014 - Rubber, unvulcanized - Determinations using a shearing-disc viscometer - Part 1: Determination of Mooney viscosity',
    'ASTM D1646-17 - Standard Test Methods for Rubber-Viscosity, Stress Relaxation, and Pre-Vulcanization Characteristics (Mooney Viscometer)',
    'DIN 53523-3 - Testing of rubber - Viscosity measurement using the Mooney viscometer'
  ]
};
