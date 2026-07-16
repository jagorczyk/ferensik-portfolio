export interface ModelInfo {
  id: string
  number: string
  label: string
  price: string
  description: string
}

export const MODELS: ModelInfo[] = [
  {
    id: 'sara',
    number: '01',
    label: 'Sara',
    price: '149 zł',
    description:
      'Miejski hatchback w skali 1:1 — przeszklona kabina, działające światła i dopracowany lakier z realistycznym połyskiem. Gotowy pod handling, customowe felgi i szybki tuning koloru.',
  },
  {
    id: 'domek',
    number: '02',
    label: 'Domek',
    price: '249 zł',
    description:
      'Drewniany dom jednorodzinny z pełnym wnętrzem, przygotowany pod interiory RP. Komplet tekstur PBR, poprawny collision zewnętrzny i wewnętrzny, gotowy do wstawienia na mapę serwera.',
  },
  {
    id: 'sv',
    number: '03',
    label: 'SV',
    price: '199 zł',
    description:
      'Niskie sportowe coupe przygotowane pod driftowe fizyki. Pełna siatka zewnętrzna, wymodelowany kokpit i tekstury w rozdzielczości 2K — sprawdza się równie dobrze na zdjęciach, co w grze.',
  },
  {
    id: 'gielda',
    number: '04',
    label: 'Giełda',
    price: '199 zł',
    description:
      'Obiekt giełdy przygotowany do osadzenia na mapie serwera MTA. Zawiera kompletną geometrię oraz tekstury.',
  },
  {
    id: 'gurzad',
    number: '05',
    label: 'Urząd',
    price: '229 zł',
    description:
      'Model budynku urzędu z kompletem materiałów i tekstur, gotowy do wykorzystania jako punkt usługowy na mapie.',
  },
  {
    id: 'lscarstore',
    number: '06',
    label: 'Salon samochodowy',
    price: '249 zł',
    description:
      'Budynek salonu samochodowego do stref dealerskich i ekspozycji pojazdów w świecie MTA.',
  },
  {
    id: 'stacjals',
    number: '07',
    label: 'Stacja LS',
    price: '179 zł',
    description:
      'Model stacji paliw z Los Santos, wyposażony w przypisane tekstury i gotowy do użycia na serwerze.',
  },
]
