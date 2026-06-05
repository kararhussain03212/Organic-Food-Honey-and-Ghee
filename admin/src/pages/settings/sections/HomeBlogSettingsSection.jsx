import FieldRows from "./FieldRows";

export default function HomeBlogSettingsSection({
  fieldKeys,
  form,
  setField,
  toLabel,
}) {
  return <FieldRows keys={fieldKeys} form={form} setField={setField} toLabel={toLabel} />;
}
