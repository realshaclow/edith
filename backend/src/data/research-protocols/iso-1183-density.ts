export const iso1183Protocol = {
  id: 'iso-1183',
  title: 'ISO 1183 - Badanie Gęstości Plastików',
  description: 'Kompleksowy protokół do określania gęstości niewnzmocnionych i wzmocnionych plastików metodą zanurzeniową i metodą kolumny gradientowej.',
  category: 'physical',
  estimatedDuration: '45-60 minut na próbkę',
  difficulty: 'basic',
  
  overview: {
    purpose: 'Określenie gęstości plastików jako podstawowej właściwości fizycznej wpływającej na właściwości mechaniczne i przetwarzanie.',
    scope: 'Stosowane do wszystkich rodzajów plastików w formie granul, arkuszy, płyt lub gotowych wyrobów.',
    principles: 'Gęstość jest określana na podstawie prawa Archimedesa przez pomiar masy próbki w powietrzu i w cieczy o znanej gęstości.',
    standards: ['ISO 1183-1:2019', 'ISO 1183-2:2019', 'ASTM D792']
  },

  equipment: [
    { name: 'Waga Analityczna', specification: 'Dokładność ±0.1mg z zestawem do ważenia hydrostatycznego' },
    { name: 'Termometr', specification: 'Dokładność ±0.1°C' },
    { name: 'Zlewka', specification: 'Pojemność minimum 250ml, wysoka' },
    { name: 'Ciecz Zanurzeniowa', specification: 'Woda destylowana lub etanol (w zależności od materiału)' },
    { name: 'Pęseta', specification: 'Do manipulacji małymi próbkami' },
    { name: 'Piknometr', specification: 'Dla metody piknometrycznej (opcjonalna)' },
    { name: 'Środek Zwilżający', specification: 'Np. kilka kropli detergentu (dla hydrofobowych materiałów)' },
    { name: 'Pompa Próżniowa', specification: 'Do usuwania pęcherzy powietrza (opcjonalna)' }
  ],

  materials: [
    'Próbki testowe (granule lub fragmenty o masie 1-5g)',
    'Woda destylowana',
    'Etanol (dla materiałów rozpuszczalnych w wodzie)',
    'Środek zwilżający',
    'Rękawice laboratoryjne',
    'Papier filtracyjny'
  ],

  safetyGuidelines: [
    'Noś rękawice podczas pracy z rozpuszczalnikami',
    'Upewnij się o dobrej wentylacji przy użyciu etanolu',
    'Uważaj na szklane naczynia - mogą pęknąć',
    'Nie dotykaj próbek bezpośrednio palcami',
    'Sprawdź kompatybilność materiału z cieczą zanurzeniową'
  ],

  testConditions: {
    temperature: '23±2°C (standardowa)',
    humidity: '50±5% RH',
    conditioning: 'Minimum 16 godzin w standardowych warunkach',
    immersionFluid: 'Woda destylowana (standardowa) lub etanol',
    sampleSize: '1-5g masy próbki'
  },

  steps: [
    {
      id: 'prep-1',
      title: 'Przygotowanie Próbek',
      description: 'Przygotuj próbki do badania gęstości',
      duration: '15 minut',
      instructions: [
        'Wybierz reprezentatywne próbki materiału',
        'Dla granulek: weź około 1-2g materiału',
        'Dla arkuszy: wytnij próbki 10x10mm',
        'Usuń wszelkie zanieczyszczenia',
        'Sprawdź czy próbki nie zawierają pęcherzy powietrza',
        'Kondycjonuj próbki w standardowych warunkach'
      ],
      tips: [
        'Próbki powinny być reprezentatywne dla całej partii',
        'Unikaj próbek z krawędzi arkuszy - mogą zawierać naprężenia',
        'Dla materiałów porowatych rozważ metodę piknometryczną'
      ],
      safety: [
        'Noś rękawice podczas manipulacji próbkami',
        'Unikaj uszkodzeń próbek ostrymi narzędziami',
        'Nie wdychaj pyłu z cięcia'
      ]
    },
    {
      id: 'prep-2',
      title: 'Przygotowanie Układu Pomiarowego',
      description: 'Przygotuj wagę i ciecz do pomiaru hydrostatycznego',
      duration: '10 minut',
      instructions: [
        'Ustaw wagę na stabilnej powierzchni',
        'Zainstaluj zestaw do ważenia hydrostatycznego',
        'Napełnij zlewkę cieczą zanurzeniową',
        'Dodaj kroplę środka zwilżającego (dla materiałów hydrofobowych)',
        'Sprawdź temperaturę cieczy',
        'Skalibruj wagę z puszczonym koszykiem'
      ],
      tips: [
        'Temperatura cieczy powinna być stabilna ±0.5°C',
        'Koszyczek musi być całkowicie zanurzony',
        'Usuń pęcherze powietrza z powierzchni koszyczka'
      ],
      safety: [
        'Sprawdź stabilność ustawienia wagi',
        'Uważaj na rozlanie cieczy',
        'Sprawdź czy kable są suche'
      ]
    },
    {
      id: 'test-1',
      title: 'Pomiar Masy w Powietrzu',
      description: 'Zważ próbkę w standardowych warunkach',
      duration: '5 minut',
      instructions: [
        'Umieść próbkę na wadze',
        'Odczekaj na stabilizację wskazań',
        'Zapisz masę próbki w powietrzu (m₁)',
        'Sprawdź czy próbka nie utraciła fragmentów',
        'Powtórz pomiar dla sprawdzenia',
        'Zapisz temperaturę pomiaru'
      ],
      tips: [
        'Unikaj przeciągów powietrza podczas ważenia',
        'Próbka powinna być całkowicie sucha',
        'Sprawdź stabilność wskazań przed odczytem'
      ],
      safety: [
        'Nie dotykaj próbki bezpośrednio',
        'Używaj pęsety do manipulacji'
      ]
    },
    {
      id: 'test-2',
      title: 'Pomiar Masy w Cieczy',
      description: 'Zważ próbkę zanurzoną w cieczy',
      duration: '10 minut',
      instructions: [
        'Umieść próbkę w koszyczku pod powierzchnią cieczy',
        'Upewnij się że nie ma pęcherzy powietrza na próbce',
        'Delikatnie porusz próbką aby usunąć pęcherze',
        'Odczekaj na stabilizację temperatury (2-3 minuty)',
        'Zapisz masę próbki w cieczy (m₂)',
        'Sprawdź temperaturę cieczy'
      ],
      tips: [
        'Pęcherze powietrza znacznie wpływają na wynik',
        'Próbka musi być całkowicie zanurzona',
        'Nie dotykaj ścianek naczynia'
      ],
      safety: [
        'Uważaj na rozlanie cieczy',
        'Nie zanurzaj rąk w cieczy',
        'Sprawdź czy nie ma przecieków'
      ]
    },
    {
      id: 'calc-1',
      title: 'Obliczenia Gęstości',
      description: 'Oblicz gęstość próbki na podstawie pomiarów',
      duration: '10 minut',
      instructions: [
        'Znajdź gęstość cieczy w temperaturze pomiaru (ρ₀)',
        'Oblicz gęstość próbki: ρ = (m₁ × ρ₀) / (m₁ - m₂)',
        'Sprawdź czy wynik jest sensowny dla danego materiału',
        'Powtórz obliczenia dla sprawdzenia',
        'Porównaj z danymi literaturowymi',
        'Oblicz niepewność pomiaru'
      ],
      tips: [
        'Gęstość wody przy 23°C wynosi 0.9975 g/cm³',
        'Sprawdź poprawność wszystkich obliczeń',
        'Wynik podaj z odpowiednią liczbą cyfr znaczących'
      ],
      safety: []
    }
  ],

  calculations: {
    density: 'ρ = (m₁ × ρ₀) / (m₁ - m₂) [g/cm³]',
    waterDensity: 'ρ_wody(23°C) = 0.9975 g/cm³',
    where: {
      'm₁': 'masa próbki w powietrzu [g]',
      'm₂': 'masa próbki w cieczy [g]',
      'ρ₀': 'gęstość cieczy zanurzeniowej [g/cm³]',
      'ρ': 'gęstość próbki [g/cm³]'
    }
  },

  acceptanceCriteria: {
    repeatability: 'Różnica między pomiarami < 0.0005 g/cm³',
    temperatureStability: 'Temperatura stabilna ±0.5°C podczas pomiarów',
    minimumSamples: 'Minimum 3 pomiary na materiał',
    sampleIntegrity: 'Próbka nie może rozpuszczać się w cieczy'
  },

  commonIssues: [
    {
      problem: 'Pęcherze powietrza na próbce',
      causes: [
        'Hydrofobowa powierzchnia materiału',
        'Chropowata powierzchnia próbki',
        'Brak środka zwilżającego',
        'Za szybkie zanurzenie'
      ],
      solutions: [
        'Dodaj środek zwilżający do cieczy',
        'Delikatnie porusz próbką',
        'Użyj próżni do usunięcia powietrza',
        'Zanurzaj próbkę powoli'
      ]
    },
    {
      problem: 'Niestabilne wskazania wagi',
      causes: [
        'Przeciągi powietrza',
        'Drgania powierzchni',
        'Niestabilna temperatura',
        'Dotykanie naczynia'
      ],
      solutions: [
        'Osłoń wagę przed przeciągami',
        'Sprawdź stabilność podłoża',
        'Odczekaj na stabilizację temperatury',
        'Nie dotykaj układu podczas pomiaru'
      ]
    },
    {
      problem: 'Próbka rozpuszcza się w cieczy',
      causes: [
        'Niewłaściwy wybór cieczy zanurzeniowej',
        'Materiał rozpuszczalny w wodzie',
        'Za długi czas kontaktu',
        'Za wysoka temperatura'
      ],
      solutions: [
        'Użyj etanolu zamiast wody',
        'Skróć czas pomiaru',
        'Obniż temperaturę',
        'Rozważ metodę piknometryczną'
      ]
    }
  ],

  typicalValues: {
    'PE-LD': '0.910-0.925 g/cm³',
    'PE-HD': '0.940-0.970 g/cm³',
    'PP': '0.895-0.920 g/cm³',
    'PS': '1.040-1.065 g/cm³',
    'PVC': '1.350-1.450 g/cm³',
    'ABS': '1.030-1.060 g/cm³',
    'PC': '1.200-1.220 g/cm³',
    'PMMA': '1.170-1.200 g/cm³'
  },

  references: [
    'ISO 1183-1:2019 - Plastics - Methods for determining the density of non-cellular plastics - Part 1: Immersion method',
    'ISO 1183-2:2019 - Part 2: Density gradient column method',
    'ASTM D792-20 - Standard Test Methods for Density and Specific Gravity of Plastics by Displacement'
  ]
};
