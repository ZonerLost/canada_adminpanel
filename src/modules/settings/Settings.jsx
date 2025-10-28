import React, { useEffect, useRef, useState } from "react";
import { getSettings, saveSettings } from "./api/settings.services.js";
import Section from "./components/Section.jsx";
import ColorInput from "./components/ColorInput.jsx";

export default function Settings() {
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [s, setS] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setBusy(true);
      const res = await getSettings();
      if (active && res?.ok) setS(res.data);
      setBusy(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  function setField(path, val) {
    setS((prev) => {
      const next = structuredClone(prev);
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts.at(-1)] = val;
      return next;
    });
  }

  async function onSave() {
    setSaving(true);
    const res = await saveSettings(s);
    setSaving(false);
    if (res?.ok) {
      // optional toast
    }
  }

  async function onPickLogo(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setField("branding.logo", reader.result);
    reader.readAsDataURL(f);
  }

  if (busy || !s) {
    return (
      <div className="grid gap-4">
        <div className="card p-5 space-y-3">
          <div className="skel h-4 w-56" />
          <div className="skel h-10 w-full" />
          <div className="skel h-10 w-3/4" />
        </div>
        <div className="card p-5 space-y-3">
          <div className="skel h-4 w-40" />
          <div className="skel h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 no-table-anim">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <div className="text-sm text-muted">
            Organization, branding, auth, and providers
          </div>
        </div>
        <button className="btn" onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section
          title="Organization"
          hint="Basic information used across the platform"
        >
          <div className="grid gap-3">
            <label className="block">
              <span className="text-sm text-muted">Organization Name</span>
              <input
                className="input mt-1"
                value={s.org.name}
                onChange={(e) => setField("org.name", e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-sm text-muted">Legal Name</span>
              <input
                className="input mt-1"
                value={s.org.legalName}
                onChange={(e) => setField("org.legalName", e.target.value)}
              />
            </label>

            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-muted">Support Email</span>
                <input
                  className="input mt-1"
                  type="email"
                  value={s.org.supportEmail}
                  onChange={(e) => setField("org.supportEmail", e.target.value)}
                />
              </label>

              <label className="block">
                <span className="text-sm text-muted">Timezone</span>
                <input
                  className="input mt-1"
                  placeholder="America/Toronto"
                  value={s.org.timezone}
                  onChange={(e) => setField("org.timezone", e.target.value)}
                />
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-muted">Default Locale</span>
                <input
                  className="input mt-1"
                  value={s.org.defaultLocale}
                  onChange={(e) =>
                    setField("org.defaultLocale", e.target.value)
                  }
                />
              </label>
              <label className="block">
                <span className="text-sm text-muted">
                  Supported Locales (comma-sep)
                </span>
                <input
                  className="input mt-1"
                  value={s.org.supportedLocales.join(", ")}
                  onChange={(e) =>
                    setField(
                      "org.supportedLocales",
                      e.target.value
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean)
                    )
                  }
                />
              </label>
            </div>
          </div>
        </Section>

        <Section title="Branding" hint="Logo and theme colors">
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <div
                className="h-16 w-16 rounded border overflow-hidden grid place-items-center"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface-2)",
                }}
              >
                {s.branding.logo ? (
                  <img
                    src={s.branding.logo}
                    alt="Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-muted">No logo</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  className="hidden"
                  onChange={onPickLogo}
                />
                <button
                  className="btn-ghost"
                  onClick={() => fileRef.current?.click()}
                >
                  Upload
                </button>
                {s.branding.logo && (
                  <button
                    className="btn-ghost"
                    onClick={() => setField("branding.logo", "")}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <ColorInput
              label="Primary"
              value={s.branding.primary}
              onChange={(v) => setField("branding.primary", v)}
            />
            <ColorInput
              label="Accent"
              value={s.branding.accent}
              onChange={(v) => setField("branding.accent", v)}
            />
          </div>
        </Section>

        <Section title="Auth & Security" hint="Policies applied to all users">
          <div className="grid gap-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-muted">Min Password Length</span>
                <input
                  className="input mt-1"
                  type="number"
                  min={6}
                  value={s.auth.minPasswordLen}
                  onChange={(e) =>
                    setField("auth.minPasswordLen", Number(e.target.value || 0))
                  }
                />
              </label>

              <label className="block">
                <span className="text-sm text-muted">
                  Session Timeout (minutes)
                </span>
                <input
                  className="input mt-1"
                  type="number"
                  min={15}
                  step={15}
                  value={s.auth.sessionMinutes}
                  onChange={(e) =>
                    setField("auth.sessionMinutes", Number(e.target.value || 0))
                  }
                />
              </label>
            </div>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-[var(--primary)]"
                checked={s.auth.require2fa}
                onChange={(e) => setField("auth.require2fa", e.target.checked)}
              />
              <span className="text-sm">Require 2FA for admins</span>
            </label>
          </div>
        </Section>

        <Section title="Providers" hint="Email and SMS gateways">
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-muted">Email Provider</span>
                <input
                  className="input mt-1"
                  value={s.providers.email.name}
                  onChange={(e) =>
                    setField("providers.email.name", e.target.value)
                  }
                />
              </label>
              <label className="block">
                <span className="text-sm text-muted">Email API Key</span>
                <input
                  className="input mt-1"
                  type="password"
                  value={s.providers.email.apiKey}
                  onChange={(e) =>
                    setField("providers.email.apiKey", e.target.value)
                  }
                />
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-muted">SMS Provider</span>
                <input
                  className="input mt-1"
                  value={s.providers.sms.name}
                  onChange={(e) =>
                    setField("providers.sms.name", e.target.value)
                  }
                />
              </label>
              <label className="block">
                <span className="text-sm text-muted">SMS API Key</span>
                <input
                  className="input mt-1"
                  type="password"
                  value={s.providers.sms.apiKey}
                  onChange={(e) =>
                    setField("providers.sms.apiKey", e.target.value)
                  }
                />
              </label>
            </div>
          </div>
        </Section>

        <Section title="Default Notifications" hint="Admin email alerts">
          <div className="grid gap-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-[var(--primary)]"
                checked={s.notifications.userSignUp}
                onChange={(e) =>
                  setField("notifications.userSignUp", e.target.checked)
                }
              />
              <span className="text-sm">Notify on new user signups</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-[var(--primary)]"
                checked={s.notifications.dailyDigest}
                onChange={(e) =>
                  setField("notifications.dailyDigest", e.target.checked)
                }
              />
              <span className="text-sm">Send daily digest</span>
            </label>
          </div>
        </Section>
      </div>

      <div className="flex justify-end">
        <button className="btn" onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
