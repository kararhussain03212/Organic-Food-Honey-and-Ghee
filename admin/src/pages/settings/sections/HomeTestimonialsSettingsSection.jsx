import { Link } from "react-router-dom";
import FieldRows from "./FieldRows";

export default function HomeTestimonialsSettingsSection({ fieldKeys, form, setField, toLabel }) {
  return (
    <>
      <div className="rounded-xl border border-[var(--admin-border-amber)]/40 bg-[var(--admin-primary)]/10 p-4 text-sm">
        <p className="font-semibold text-[var(--admin-primary)]">Section Heading Settings</p>
        <p className="mt-1 text-white/60">
          Edit the eyebrow, heading, and subtext shown above the testimonial carousel.
          To manage individual testimonial cards (customer name, photo, quote, rating),{" "}
          <Link to="/testimonials" className="text-[var(--admin-primary)] underline hover:text-[var(--admin-primary-strong)]">
            go to Testimonials →
          </Link>
        </p>
      </div>

      <FieldRows keys={fieldKeys} form={form} setField={setField} toLabel={toLabel} />
    </>
  );
}
