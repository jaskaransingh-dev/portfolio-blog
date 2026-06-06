export const profile = {
  name: "Jaskaran Singh",
  shortName: "Jaz",
  role: "Software Engineer",
  location: "Los Angeles, CA",
  university: "UCLA — Statistics & Data Science, B.S. ('27)",
  photo: "/profile.jpg",
  initials: "JS",
  email: "jazing14@gmail.com",
  links: {
    linkedin: "https://linkedin.com/in/jsingh06",
    github: "https://github.com/jaskaransingh-dev",
  },
  currentWork: { label: "TrueMile.AI", href: "https://truemile.ai" },
};

export type Project = {
  id: string;
  name: string;
  role: string;
  tagline: string;
  description: string;
  stack: string[];
  href?: string;
  logo?: string;
  logoInvert?: boolean;
  accentColor: string;
  year: string;
  status: "live" | "building" | "shipped";
};

export const projects: Project[] = [
  {
    id: "truemile",
    name: "TrueMile.AI",
    role: "Founder & Lead Engineer",
    tagline: "Every mile. Decided.",
    description:
      "Agentic optimization for mid-market trucking carriers. A seven-constraint dispatch engine ranks available loads by revenue-per-day and effective RPM, normalizes load data with GPT-4o-mini, and automates broker outreach over Gmail and Microsoft Graph. In live shadow testing with a 15-truck carrier.",
    stack: ["Next.js", "PostgreSQL", "Prisma", "GPT-4o-mini", "Railway"],
    href: "https://truemile.ai",
    logo: "/logos/truemile.png",
    accentColor: "#e8520a",
    year: "2026",
    status: "building",
  },
  {
    id: "ase",
    name: "Agent Securities Exchange",
    role: "Founder",
    tagline: "A trading desk in your browser.",
    description:
      "A marketplace for tokenized algorithmic trading strategies. Retail investors allocate capital to AI trading agents — validated with CPCV and Deflated Sharpe Ratio to filter backtest overfitting — running on connected Kraken or Alpaca accounts. 174 verified agents live, minimum $10.",
    stack: ["ERC-3643", "Chainlink", "Solidity", "Next.js", "Vercel"],
    href: "https://ase-nu.vercel.app",
    logo: "/logos/ase.png",
    logoInvert: true,
    accentColor: "#3b5bdb",
    year: "2026",
    status: "live",
  },
  {
    id: "hush",
    name: "Hush",
    role: "Founding Engineer",
    tagline: "AI-powered technical recruitment.",
    description:
      "A serverless recruitment platform built on AWS Lambda, FastAPI, and Next.js. Semantic candidate-job matching over Bedrock and OpenSearch vector embeddings lifted relevance by 25%. Contributed to a $5M valuation and 10+ signed letters of intent.",
    stack: ["FastAPI", "Next.js", "AWS Lambda", "Bedrock", "OpenSearch"],
    href: "https://hushtalent.io",
    accentColor: "#1a1a2e",
    year: "2025",
    status: "shipped",
  },
  {
    id: "tones",
    name: "Tones",
    role: "Sole Engineer",
    tagline: "Voice-first messaging for iOS.",
    description:
      "A voice messaging app shipped to the App Store and Product Hunt. SwiftUI frontend with audio waveform recording, and a fully serverless backend on Cloudflare Workers — auth, social graph, content moderation, and R2 media storage — with zero cold-start latency.",
    stack: ["Swift", "SwiftUI", "Cloudflare Workers", "D1", "R2"],
    accentColor: "#6b21a8",
    year: "2026",
    status: "live",
  },
  {
    id: "achievable",
    name: "Achievable",
    role: "Data Science Lead",
    tagline: "Adaptive exam prep backed by learning science.",
    description:
      "Led end-to-end ETL and feature-engineering pipelines over 200k+ records and shipped Plotly Dash dashboards surfacing psychometric model outputs to 10,000+ active users. Designed a Bayesian assessment framework that improved reliability by 20%.",
    stack: ["Python", "Plotly Dash", "Bayesian ML", "PostgreSQL"],
    href: "https://achievable.me",
    accentColor: "#0d7a5f",
    year: "2024",
    status: "shipped",
  },
  {
    id: "wildfire",
    name: "Wildfire Risk AI",
    role: "Engineer",
    tagline: "Real-time risk visualization on Palantir Foundry.",
    description:
      "Automated geospatial pipelines ingesting 12+ datasets into a unified 1M+ object ontology on Palantir Foundry, with a Slate UI for real-time wildfire risk scoring and emergency-response triage used by first-responder teams.",
    stack: ["Palantir Foundry", "Python", "Pipeline Builder", "Slate"],
    accentColor: "#9a3412",
    year: "2025",
    status: "shipped",
  },
];

export const skills = [
  { group: "Languages",  items: ["Python", "TypeScript", "C++", "SQL", "R"] },
  { group: "Frameworks", items: ["Next.js", "React", "FastAPI", "Node", "Tailwind"] },
  { group: "Cloud / ML", items: ["AWS", "Palantir Foundry", "RAG", "Vector Search", "Docker"] },
];
