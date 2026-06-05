import ImageUpload from "../../../components/ImageUpload";
import FieldRows from "./FieldRows";

export default function BlogSettingsSection({
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
        <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]">Blog Hero Image</label>
        <ImageUpload
          value={toImageUrl(form.blog_page_hero_image)}
          onFileSelect={(file) => uploadToSetting("blog_page_hero_image", file, "settings")}
          label="Upload Blog Hero Image"
          helperText="Banner image for Blog page header"
        />
      </div>
    </>
  );
}
