export interface AboutValue {
  id: string;
  icone: string;
  titre: string;
  description: string;
}

export interface AboutPhoto {
  id: string;
  url: string;
  legende: string;
}

export interface AboutVideo {
  id: string;
  titre: string;
  url: string;
  description: string;
  thumbnail?: string;
  ordre?: number;
}

export interface AboutSectionConfig {
  heroLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  heroText: string;
  heroMission: string;
  heroQuote: string;
  heroImage: string;
  founderLabel: string;
  founderSectionTitle: string;
  founderName: string;
  founderRole: string;
  founderBioShort: string;
  founderBioLong: string;
  founderQuote: string;
  founderImage: string;
  valuesLabel: string;
  valuesTitle: string;
  valuesIntro: string;
  mediaLabel: string;
  mediaTitle: string;
  mediaIntro: string;
  closingText: string;
  closingCtaLabel: string;
  closingCtaLink: string;
}
