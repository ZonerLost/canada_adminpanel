const USE_MOCK = (import.meta?.env?.VITE_USE_MOCK ?? "1") === "1";
const STORAGE_KEY = "__settings_v1";

function loadMock() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  const seed = {
    org: {
      name: "Cuidado Admin",
      legalName: "Cuidado Latino Inc.",
      supportEmail: "support@cuidado.example",
      timezone: "America/Toronto",
      defaultLocale: "en-CA",
      supportedLocales: ["en-CA", "es-MX", "es-CO"],
    },
    branding: {
      logo: "",
      primary: "#0ea5e9",
      accent: "#6ea8fe",
    },
    auth: {
      minPasswordLen: 8,
      require2fa: false,
      sessionMinutes: 60,
    },
    providers: {
      email: { name: "Resend", apiKey: "" },
      sms: { name: "Twilio", apiKey: "" },
    },
    notifications: {
      userSignUp: true,
      dailyDigest: true,
    },
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

export async function getSettings() {
  if (USE_MOCK) return { ok: true, data: loadMock() };
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.get("/settings");
  return { ok: true, data: data?.data ?? data };
}

export async function saveSettings(next) {
  if (USE_MOCK) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return { ok: true, data: next };
  }
  const { default: client } = await import("../../../shared/http/client.js");
  const { data } = await client.put("/settings", next);
  return { ok: true, data: data?.data ?? data };
}
