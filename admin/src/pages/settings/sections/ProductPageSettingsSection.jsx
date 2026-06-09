import { useEffect, useState } from "react";
import { getProductPageSettings } from "../../../api/productPageApi";

export default function ProductPageSettingsSection({ onDataLoaded, onDataChange }) {
  const [settings, setSettings] = useState({
    badge_text: "",
    title: "",
    subtitle: "",
  });

  useEffect(() => {
    getProductPageSettings().then((res) => {
      const data = res?.data?.data ?? res?.data ?? {};
      if (data && typeof data === "object" && !Array.isArray(data)) {
        const normalized = {
          badge_text: data.badge_text || "",
          title:      data.title      || "",
          subtitle:   data.subtitle   || "",
        };
        setSettings(normalized);
        if (onDataLoaded) onDataLoaded("product_page", normalized);
      }
    });
  }, [onDataLoaded]);

  const handleChange = (field, value) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    if (onDataChange) onDataChange("product_page", newSettings);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-3 md:grid-cols-[280px_1fr] md:items-start">
        <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]">Badge Text</label>
        <input
          type="text"
          placeholder="e.g., ✦ Arion Organics"
          value={settings.badge_text || ""}
          onChange={(e) => handleChange("badge_text", e.target.value)}
          className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-3 md:grid-cols-[280px_1fr] md:items-start">
        <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]">Title</label>
        <input
          type="text"
          placeholder="e.g., Our Products"
          value={settings.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-3 md:grid-cols-[280px_1fr] md:items-start">
        <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]">Subtitle</label>
        <textarea
          placeholder="e.g., Pure, traditional, and naturally sourced wellness essentials for your everyday life."
          value={settings.subtitle || ""}
          onChange={(e) => handleChange("subtitle", e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
        />
      </div>
    </div>
  );
}
