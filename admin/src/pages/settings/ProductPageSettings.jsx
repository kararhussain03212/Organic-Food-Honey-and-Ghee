import { useCallback, useEffect, useState } from "react";
import { getProductPageSettings, updateProductPageSettings } from "../../api/productPageApi";
import ProductPageSettingsSection from "./sections/ProductPageSettingsSection";

export default function ProductPageSettings() {
  const [settings, setSettings] = useState({
    badge_text: "",
    title: "",
    subtitle: "",
    seo_meta_description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getProductPageSettings();
        const data = res?.data?.data ?? res?.data ?? {};
        if (data && typeof data === "object" && !Array.isArray(data)) {
          setSettings({
            badge_text: data.badge_text || "",
            title:      data.title      || "",
            subtitle:   data.subtitle   || "",
            seo_meta_description: data.seo_meta_description || "",
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load product page settings.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateProductPageSettings(settings);
      setSuccess("Product page settings saved successfully.");

      // Re-fetch to confirm what was actually persisted
      const res = await getProductPageSettings();
      const data = res?.data?.data ?? res?.data ?? {};
      if (data && typeof data === "object" && !Array.isArray(data)) {
        setSettings({
          badge_text: data.badge_text || "",
          title:      data.title      || "",
          subtitle:   data.subtitle   || "",
          seo_meta_description: data.seo_meta_description || "",
        });
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }, [settings]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const isSaveCombo = (event.ctrlKey || event.metaKey) && String(event.key || "").toLowerCase() === "s";
      if (!isSaveCombo) return;
      event.preventDefault();
      if (!loading && !saving) handleSave();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loading, saving, handleSave]);

  if (loading) return <p className="text-white/70">Loading settings...</p>;

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-white">Product Page Settings</h2>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-red-700">{error}</div>
      ) : null}
      {success ? (
        <div className="rounded-xl border border-green-500/25 bg-green-500/10 px-4 py-3 text-green-700">{success}</div>
      ) : null}

      <article className="space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-4 shadow-sm md:p-5">
        <ProductPageSettingsSection
          onDataChange={(section, data) => setSettings(data)}
        />
      </article>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-white shadow-sm hover:bg-[var(--admin-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </section>
  );
}
