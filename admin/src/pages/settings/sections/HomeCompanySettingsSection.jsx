import ImageUpload from "../../../components/ImageUpload";
import FieldRows from "./FieldRows";

export default function HomeCompanySettingsSection({
  fieldKeys,
  form,
  setField,
  toLabel,
  toImageUrl,
  uploadToSetting,
}) {
  return (
    <>
      <FieldRows keys={fieldKeys} form={form} setField={setField} toLabel={toLabel} />
      <div className="grid grid-cols-1 gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-3 md:grid-cols-[280px_1fr] md:items-start">
        <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]">Home Company Image</label>
        <ImageUpload
          value={toImageUrl(form.home_company_image)}
          onFileSelect={(file) => uploadToSetting("home_company_image", file, "settings")}
          label="Upload Company Image"
          helperText="Used in Home company section"
        />
      </div>
    </>
  );
}
