// Central place for the app's main tunable settings. Change values here
// instead of hunting through individual modules.

export const config = {
  openai: {
    apiUrl: "https://api.openai.com/v1/chat/completions",
    defaultModel: "gpt-4o-mini",
  },

  scan: {
    minXp: 6,
    maxXp: 17,
    temperature: 0.3,
    maxTokens: 400,
  },

  chat: {
    temperature: 0.5,
    maxTokens: 300,
    historyLimit: 10,
  },

  auth: {
    cookieName: "resort_session",
    sessionSeconds: 60 * 60 * 24 * 30, // 30 days
    bcryptSaltRounds: 10,
  },

  image: {
    maxDim: 1024,
    quality: 0.85,
  },

  map: {
    overpassEndpoints: [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
    ],
    maxPoints: 30,
    cacheTtlMs: 24 * 60 * 60 * 1000, // 24 hours
  },

  history: {
    listLimit: 60,
    statsWindowMs: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  leaderboard: {
    limit: 50,
  },

  db: {
    name: "user_mvp",
  },

  links: {
    github: "https://github.com/Kvazar-213452/re-sort-ai",
    readme: "https://github.com/Kvazar-213452/re-sort-ai",
  },
} as const;
