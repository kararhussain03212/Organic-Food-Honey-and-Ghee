import FieldRows from "./FieldRows";

export default function HomeAuthenticSettingsSection({ fieldKeys, form, setField, toLabel }) {
  return (
    <>
      <div className="rounded-xl border border-[var(--admin-border-amber)]/40 bg-[var(--admin-primary)]/10 p-4 text-sm">
        <p className="font-semibold text-[var(--admin-primary)]">Authentic / CTA Section</p>
        <p className="mt-1 text-white/60">
          Controls the full-width call-to-action section at the bottom of the homepage —
          eyebrow label, heading, description, both buttons, and the authenticity badge text.
        </p>
      </div>

      <FieldRows keys={fieldKeys} form={form} setField={setField} toLabel={toLabel} />
    </>
  );
}
