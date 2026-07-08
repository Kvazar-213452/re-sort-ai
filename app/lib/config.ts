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
    defaultView: { lat: 51.1657, lng: 10.4515, zoom: 6 },
    overpassEndpoints: [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
    ],
    maxPoints: 30,
  },

  db: {
    name: "user_mvp",
  },
} as const;
