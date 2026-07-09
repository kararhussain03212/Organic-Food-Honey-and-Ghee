import { useEffect, useMemo, useState } from "react";
import { getBackendRoot } from "../api/runtimeApi";

const ImageUpload = ({
  value = "",
  altText = "",
  onFileSelect,
  onAltTextChange,
  label = "Upload Image",
  helperText = "PNG, JPG, JPEG (Frontend brand theme)",
  accept = "image/*",
  required = false,
  includeAltText = false,
}) => {
  const [objectUrl, setObjectUrl] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const apiRoot = useMemo(() => getBackendRoot(), []);

  const resolveImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("blob:")) return url;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads/")) return apiRoot + url;
    if (url.startsWith("/")) return apiRoot + url;
    return `${apiRoot}/uploads/${url}`;
  };

  const preview = objectUrl || resolveImageUrl(value) || "";

  // prevents memory leaks when user changes image many times
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  // Log for debugging
  useEffect(() => {
    if (preview) {
      console.log("ImageUpload preview URL:", preview);
    }
  }, [preview]);

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

      {preview && !imageError ? (
        <img
          src={preview}
          alt="Preview"
          className="mt-4 h-36 w-full rounded-lg object-cover"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{ display: imageLoaded ? "block" : "block" }}
        />
      ) : null}
      {imageError && preview ? (
        <div className="mt-4 flex h-36 w-full items-center justify-center rounded-lg border border-dashed border-red-500/50 bg-red-500/10 text-sm text-red-400">
          Failed to load image: {preview.slice(0, 50)}...
        </div>
      ) : null}

      {includeAltText && (
        <div className="mt-3 space-y-1">
          <label className="block text-xs font-semibold text-white/80">
            Alt Text for SEO & Accessibility
          </label>
          <input
            type="text"
            value={altText || ""}
            onChange={(e) => onAltTextChange?.(e.target.value)}
            placeholder="Describe what's in the image..."
            maxLength="150"
            className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-[var(--admin-primary)] focus:outline-none"
          />
          <p className="text-[10px] text-white/50">
            {altText?.length || 0}/150 characters
          </p>
        </div>
      )}
    </label>
  );
};

export default ImageUpload;
