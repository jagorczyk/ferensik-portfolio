export interface SkinInfo {
  id: string
  label: string
  description: string
}

export const SKINS: SkinInfo[] = [
  {
    id: 'agent',
    label: 'Agent',
    description:
      'Autorski skin postaci z niestandardową siatką głowy i ubioru. Zoptymalizowany pod standardowy szkielet CJ, gotowy do podpisania i wgrania na serwer.',
  },
  {
    id: 'randomGang',
    label: 'Random Gang',
    description:
      'Skin postaci o uproszczonej, czytelnej sylwetce. Tekstury malowane ręcznie, przygotowane tak, by dobrze wyglądały zarówno z bliska, jak i w tłumie graczy.',
  },
]
