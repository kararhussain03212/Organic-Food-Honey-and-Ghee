import { useEffect, useMemo, useState } from "react";
import { getBackendRoot } from "../api/runtimeApi";

const VideoUpload = ({
  value = "",
  onFileSelect,
  label = "Upload Video",
  helperText = "MP4, WebM, or other video formats",
  accept = "video/*",
  required = false,
}) => {
  const [objectUrl, setObjectUrl] = useState("");
  const [candidateIdx, setCandidateIdx] = useState(0);
  const apiRoot = useMemo(() => getBackendRoot(), []);

  // A stored src can be a backend upload (/uploads/...), a full URL, or a
  // frontend public asset (e.g. /images/reel.mp4). Frontend assets live at
  // the site root in production but under /dist locally, so we try both.
  const candidates = useMemo(() => {
    const url = objectUrl || value;
    if (!url) return [];
    if (url.startsWith("blob:") || url.startsWith("http")) return [url];
    if (url.startsWith("/uploads/")) return [apiRoot + url];
    const siteRoot = apiRoot.replace(/\/backend$/i, "");
    if (url.startsWith("/")) return [siteRoot + "/dist" + url, siteRoot + url];
    return [`${apiRoot}/uploads/${url}`];
  }, [objectUrl, value, apiRoot]);

  const preview = candidates[candidateIdx] || "";
  const videoError = candidates.length > 0 && candidateIdx >= candidates.length;

  useEffect(() => {
    setCandidateIdx(0);
  }, [candidates]);

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
        <video
          key={preview}
          src={preview}
          controls
          className="mt-4 h-36 w-full rounded-lg object-cover"
          onError={() => setCandidateIdx((i) => i + 1)}
        />
      ) : null}
      {videoError ? (
        <div className="mt-4 flex h-36 w-full items-center justify-center rounded-lg border border-dashed border-red-500/50 bg-red-500/10 text-sm text-red-400">
          Video preview unavailable: {String(value).slice(0, 50)}
        </div>
      ) : null}
    </label>
  );
};

export default VideoUpload;
