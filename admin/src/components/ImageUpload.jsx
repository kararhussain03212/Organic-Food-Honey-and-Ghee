import { useEffect, useState } from "react";

const ImageUpload = ({
  value = "",
  onFileSelect,
  label = "Upload Image",
  helperText = "PNG, JPG, JPEG (Frontend brand theme)",
  accept = "image/*",
  required = false,
}) => {
  const [objectUrl, setObjectUrl] = useState("");

  const preview = objectUrl || value || "";

  // prevents memory leaks when user changes image many times
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (objectUrl) URL.revokeObjectURL(objectUrl);

    const nextUrl = URL.createObjectURL(file);
    setObjectUrl(nextUrl);

    // parent form needs file for FormData submit to backend
    if (typeof onFileSelect === "function") {
      onFileSelect(file);
    }
  };

  return (
    <label className="block w-full cursor-pointer rounded-xl border border-[var(--admin-border-amber)] bg-[var(--admin-bg)] p-4 transition-colors hover:border-[var(--admin-primary)]">
      <div className="flex flex-col items-center justify-center gap-3">
        <span className="pi pi-cloud-upload text-3xl text-[var(--admin-muted)]" />
        <div className="text-center">
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="text-xs text-white/60">{helperText}</p>
        </div>
      </div>

      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        required={required}
        className="mt-3 block w-full text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-[var(--admin-primary)] file:px-3 file:py-2 file:text-black hover:file:bg-[var(--admin-primary-strong)]"
      />

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="mt-4 h-36 w-full rounded-lg object-cover"
        />
      ) : null}
    </label>
  );
};

export default ImageUpload;
