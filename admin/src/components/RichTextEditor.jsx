import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TOOLBAR_OPTIONS = [
  [{ header: [2, 3, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "blockquote"],
  ["clean"],
];

export default function RichTextEditor({ value = "", onChange, label = "Content" }) {
  const wrapperRef = useRef(null);
  const quillRef = useRef(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!wrapperRef.current || quillRef.current) return;

    const quill = new Quill(wrapperRef.current, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
      placeholder: "Write blog description...",
    });

    quill.root.innerHTML = String(value || "");
    quill.on("text-change", () => {
      isSyncingRef.current = true;
      onChange?.(quill.root.innerHTML);
      isSyncingRef.current = false;
    });

    quillRef.current = quill;
  }, [onChange, value]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill || isSyncingRef.current) return;

    const next = String(value || "");
    if (quill.root.innerHTML !== next) {
      quill.root.innerHTML = next;
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <label className="block text-sm text-white/80">{label}</label>
      <div className="rounded-xl border border-white/20 bg-[var(--admin-card)] p-3">
        <div className="admin-quill">
          <div ref={wrapperRef} className="min-h-[260px] bg-[var(--admin-bg)] text-white" />
        </div>
      </div>
    </div>
  );
}
