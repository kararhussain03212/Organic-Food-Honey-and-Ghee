import { Link } from "react-router-dom";
import FieldRows from "./FieldRows";

export default function HomeCommitmentSettingsSection({ fieldKeys, form, setField, toLabel }) {
  return (
    <>
      <div className="rounded-xl border border-[var(--admin-border-amber)]/40 bg-[var(--admin-primary)]/10 p-4 text-sm">
        {/* <p className="font-semibold text-[var(--admin-primary)]">Section Heading Settings</p> */}

          <Link to="/commitment" className="rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-white shadow-sm hover:bg-[var(--admin-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60">
            Commitment Items →
          </Link>

      </div>

      <FieldRows keys={fieldKeys} form={form} setField={setField} toLabel={toLabel} />
    </>
  );
}
