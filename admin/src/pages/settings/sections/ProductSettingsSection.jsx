import ImageUpload from "../../../components/ImageUpload";
import FieldRows from "./FieldRows";

export default function ProductSettingsSection({
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
        <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]">Product Hero Image</label>
        <ImageUpload
          value={toImageUrl(form.product_page_hero_image)}
          onFileSelect={(file) => uploadToSetting("product_page_hero_image", file, "settings")}
          label="Upload Product Hero Image"
          helperText="Banner image for Product page header"
        />
      </div>
    </>
  );
}
