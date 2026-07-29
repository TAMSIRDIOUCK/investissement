export type Criterion = {
  key: string;
  label: string;
  description: string;
  maxStars: number;
};

export const CRITERIA: Criterion[] = [
  {
    key: "profit_growth",
    label: "Croissance du bénéfice",
    description: "Augmentation régulière et durable des bénéfices sur plusieurs années.",
    maxStars: 5,
  },
  {
    key: "roe",
    label: "ROE",
    description: "Rendement des capitaux propres — efficacité à générer des profits avec les fonds des actionnaires.",
    maxStars: 5,
  },
  {
    key: "cash_flow",
    label: "Flux de trésorerie",
    description: "Capacité à générer du cash flow libre positif et récurrent.",
    maxStars: 5,
  },
  {
    key: "debt",
    label: "Dette",
    description: "Niveau d'endettement faible et maîtrisé (ratio dette/fonds propres).",
    maxStars: 5,
  },
  {
    key: "competitive_advantage",
    label: "Avantage concurrentiel",
    description: "Large économique, marque forte, brevets ou position dominante sur le marché.",
    maxStars: 5,
  },
  {
    key: "management_quality",
    label: "Qualité du management",
    description: "Équipe dirigeante expérimentée, transparente et alignée avec les actionnaires.",
    maxStars: 5,
  },
  {
    key: "dividends",
    label: "Dividendes réguliers",
    description: "Distribution régulière et croissante de dividendes sur le long terme.",
    maxStars: 5,
  },
  {
    key: "margins",
    label: "Marges",
    description: "Marges opérationnelles et nettes saines et stables.",
    maxStars: 5,
  },
  {
    key: "valuation",
    label: "Valorisation (PER, P/B)",
    description: "Prix d'achat raisonnable par rapport aux bénéfices et à la valeur comptable.",
    maxStars: 5,
  },
  {
    key: "sector_outlook",
    label: "Perspectives du secteur",
    description: "Tendances de marché et croissance attendue du secteur d'activité.",
    maxStars: 5,
  },
];

export const TOTAL_MAX_STARS = CRITERIA.reduce((sum, c) => sum + c.maxStars, 0);

export type Ratings = Record<string, number>;

export type ScoreBand = {
  min: number;
  max: number;
  label: string;
  color: string;
  ringColor: string;
  bgColor: string;
  textColor: string;
  recommendation: string;
};

export const SCORE_BANDS: ScoreBand[] = [
  {
    min: 85,
    max: 100,
    label: "Excellent",
    color: "#059669",
    ringColor: "ring-emerald-500",
    bgColor: "bg-emerald-500",
    textColor: "text-emerald-400",
    recommendation: "Investissement fortement recommandé. Les fondamentaux sont exceptionnels.",
  },
  {
    min: 70,
    max: 84,
    label: "Très bon",
    color: "#10b981",
    ringColor: "ring-teal-500",
    bgColor: "bg-teal-500",
    textColor: "text-teal-400",
    recommendation: "Bon investissement. La majorité des critères sont au vert.",
  },
  {
    min: 50,
    max: 69,
    label: "Correct",
    color: "#f59e0b",
    ringColor: "ring-amber-500",
    bgColor: "bg-amber-500",
    textColor: "text-amber-400",
    recommendation: "Investissement à surveiller. Plusieurs critères nécessitent attention.",
  },
  {
    min: 30,
    max: 49,
    label: "Risqué",
    color: "#f97316",
    ringColor: "ring-orange-500",
    bgColor: "bg-orange-500",
    textColor: "text-orange-400",
    recommendation: "Investissement risqué. Des points faibles importants sont présents.",
  },
  {
    min: 0,
    max: 29,
    label: "À éviter",
    color: "#ef4444",
    ringColor: "ring-red-500",
    bgColor: "bg-red-500",
    textColor: "text-red-400",
    recommendation: "Investissement déconseillé. Les fondamentaux ne sont pas réunis.",
  },
];

export function getScoreBand(score: number): ScoreBand {
  return SCORE_BANDS.find((b) => score >= b.min && score <= b.max) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}

export function computeScore(ratings: Ratings): number {
  const earned = CRITERIA.reduce((sum, c) => sum + (ratings[c.key] ?? 0), 0);
  return Math.round((earned / TOTAL_MAX_STARS) * 100);
}

export function getCriteriaCount(ratings: Ratings): number {
  return CRITERIA.filter((c) => (ratings[c.key] ?? 0) > 0).length;
}