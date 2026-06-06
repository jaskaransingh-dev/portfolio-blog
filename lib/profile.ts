// Single source of truth for Jaz's portfolio content.
// Edit anything here and the homepage updates.

export const profile = {
  name: "Jaskaran Singh",
  role: "Software Engineer",
  workingOn: { label: "TrueMile.AI", href: "https://truemile.ai" },
  location: "Los Angeles, California",
  // Drop a square photo at public/profile.jpg to replace the initials avatar.
  photo: "/profile.jpg",
  initials: "JS",
  email: "jazing14@gmail.com",
  links: {
    linkedin: "https://linkedin.com/in/jsingh06",
    github: "https://github.com/jaskaransingh-dev",
  },
};

export const currently: { text: string; href?: string; linkText?: string }[] = [
  {
    text: "Building {link}, a constraint-based AI dispatch engine for over-the-road trucking carriers.",
    href: "https://truemile.ai",
    linkText: "TrueMile.AI",
  },
  {
    text: "Studying B.S. Statistics & Data Science at {link} ('27).",
    href: "https://www.ucla.edu",
    linkText: "UCLA",
  },
  {
    text: "Founder of {link}, a marketplace for tokenized algorithmic trading strategies.",
    href: "#projects",
    linkText: "Agent Securities Exchange",
  },
];

// Free-form prose paragraphs for the "Previously" section.
export const previously: string[] = [
  "I was a founding engineer at {Hush|https://hushtalent.io}, where I architected a serverless recruitment platform on AWS with FastAPI and Next.js — work that contributed to a $5M valuation and 10+ signed letters of intent. I built its semantic search over AWS Bedrock and OpenSearch vector embeddings, lifting candidate–job match relevance by 25%.",
  "At {Fluidra|https://www.fluidra.com}, I built a serverless AI support backend on AWS Lambda and Bedrock with a vectorized knowledge base that resolved 80% of technical tickets autonomously in under two minutes, cutting manual triage by 40%.",
  "As data science lead at {Achievable|https://achievable.me}, I ran end-to-end ETL and feature-engineering pipelines over 200k+ records and shipped Plotly Dash dashboards surfacing psychometric model outputs to 10,000+ active users, designing a Bayesian framework that improved assessment reliability by 20%.",
  "Earlier I shipped {Tones|https://apps.apple.com}, a voice-first iOS messaging app, to the App Store and Product Hunt — sole engineer on the SwiftUI frontend and the Cloudflare Workers backend.",
];

export type Project = {
  num: string;
  name: string;
  tagline: string;
  stack: string[];
  href?: string;
  year: string;
  // Gradient used for the project's visual tile.
  gradient: string;
};

export const projects: Project[] = [
  {
    num: "01",
    name: "TrueMile.AI",
    tagline:
      "A constraint-based AI dispatch engine for OTR trucking. 7-constraint hard-reject filtering ranks loads by revenue-per-day and effective RPM; load normalization via GPT-4o-mini, broker outreach over Gmail/Graph, and DAT load-board ingestion. In live shadow testing with a 15-truck carrier.",
    stack: ["Next.js", "PostgreSQL", "Prisma", "GPT-4o-mini", "Railway"],
    href: "https://truemile.ai",
    year: "2026",
    gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  },
  {
    num: "02",
    name: "Agent Securities Exchange",
    tagline:
      "A fintech marketplace for algorithmic trading strategies built on ERC-3643 security tokens and Chainlink oracles, with quantitative validation (CPCV, Deflated Sharpe Ratio) to mitigate backtest overfitting. Pre-seed stage.",
    stack: ["ERC-3643", "Chainlink", "Solidity", "Next.js"],
    year: "2026",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  },
  {
    num: "03",
    name: "Tones",
    tagline:
      "A voice-first iOS messaging app shipped to the App Store and Product Hunt. A SwiftUI frontend with audio-waveform recording and a serverless Cloudflare Workers backend handling auth, friends, and content moderation.",
    stack: ["Swift", "SwiftUI", "Cloudflare Workers", "D1", "R2"],
    year: "2026",
    gradient: "linear-gradient(135deg, #42275a 0%, #734b6d 100%)",
  },
  {
    num: "04",
    name: "Wildfire Risk AI Agent",
    tagline:
      "Automated pipelines ingesting 12+ geospatial datasets into a unified 1M+ object ontology, with a Slate UI for real-time wildfire risk visualization and emergency-response triage on Palantir Foundry.",
    stack: ["Palantir Foundry", "Python", "Pipeline Builder", "Slate"],
    year: "2025",
    gradient: "linear-gradient(135deg, #3a1c0a 0%, #642b0a 50%, #9a3412 100%)",
  },
  {
    num: "05",
    name: "Hush",
    tagline:
      "A serverless AI recruitment platform on AWS with semantic search over Bedrock + OpenSearch vector embeddings (RAG). Contributed to a $5M valuation and 10+ letters of intent.",
    stack: ["FastAPI", "Next.js", "AWS Lambda", "Bedrock", "OpenSearch"],
    href: "https://hushtalent.io",
    year: "2025",
    gradient: "linear-gradient(135deg, #0b3866 0%, #1e6091 100%)",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "C++", "SQL", "R"] },
  {
    group: "Frameworks",
    items: ["React", "Next.js", "Node", "FastAPI", "Django", "Tailwind"],
  },
  {
    group: "Cloud & ML",
    items: ["AWS", "Palantir Foundry", "RAG", "Vector Embeddings", "Docker"],
  },
];
