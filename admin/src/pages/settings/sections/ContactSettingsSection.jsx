import FieldRows from "./FieldRows";

const ARION_CONTACT_KEYS = [
  "contact_email",
  "contact_phone",
  "contact_whatsapp",
  "contact_address",
  "contact_facebook",
  "contact_instagram",
  "contact_youtube",
  "contact_tiktok",
  "contact_availability_text",
  "whatsapp_number",
];

export default function ContactSettingsSection({ fieldKeys, form, setField, toLabel }) {
  const arionKeys = ARION_CONTACT_KEYS.filter((k) => k in form || fieldKeys.includes(k));
  const otherKeys = fieldKeys.filter((k) => !ARION_CONTACT_KEYS.includes(k));

  return (
    <div className="space-y-6">
      {arionKeys.length > 0 && (
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-4 space-y-4">
          <div className="border-b border-[var(--admin-border)] pb-3">
            <h4 className="text-sm font-semibold text-[var(--admin-ink)]">Contact Information</h4>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">Displayed on the Contact page and used in emails / WhatsApp links.</p>
          </div>
          {arionKeys.map((key) => {
            const isLong = key.includes("address") || key.includes("availability");
            return (
              <div key={key} className="grid grid-cols-1 gap-2 md:grid-cols-[240px_1fr] md:items-start">
                <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]">{toLabel(key)}</label>
                {isLong ? (
                  <textarea
                    rows={2}
                    value={form[key] ?? ""}
                    onChange={(e) => setField(key, e.target.value)}
                    className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
                  />
                ) : (
                  <input
                    type="text"
                    value={form[key] ?? ""}
                    onChange={(e) => setField(key, e.target.value)}
                    className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {otherKeys.length > 0 && <FieldRows keys={otherKeys} form={form} setField={setField} toLabel={toLabel} />}
    </div>
  );
}
