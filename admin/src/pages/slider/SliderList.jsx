import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteSlider, getSliders, updateSlider } from "../../api/sliderApi";
import { useAuth } from "../../context/useAuth";
import { hasPermission } from "../../modules/users/constants";
import { getBackendRoot } from "../../api/runtimeApi";

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 700'><rect width='1200' height='700' fill='#171717'/><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' fill='#ffffff' font-family='Arial,sans-serif' font-size='58'>Slider</text></svg>",
)}`;

export default function SliderList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, text: "" });

  const canAdd = hasPermission(user, "create_content");
  const canEdit = hasPermission(user, "edit_content");
  const canDelete = hasPermission(user, "delete_content");
  const canPublish = hasPermission(user, "publish_content");

  const showNoPerm = (action) => setToast({ show: true, text: `You do not have permission to ${action}.` });

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast({ show: false, text: "" }), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const apiRoot = useMemo(() => getBackendRoot(), []);

  const resolveImage = (value) => {
    if (!value) return FALLBACK_IMAGE;
    if (value.startsWith("http")) return value;
    if (value.startsWith("/uploads/")) return apiRoot + value;
    if (value.startsWith("/")) return value;
    return apiRoot + "/uploads/" + value;
  };

  useEffect(() => {
    const loadSliders = async () => {
      try {
        const res = await getSliders();
        setSliders(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load sliders.");
      } finally {
        setLoading(false);
      }
    };

    loadSliders();
  }, []);

  const handleDelete = async (id) => {
    if (!canDelete) {
      showNoPerm("delete sliders");
      return;
    }
    if (!window.confirm("Delete this slider?")) return;
    try {
      await deleteSlider(id);
      setSliders((prev) => prev.filter((item) => item.id !== id));
      // Refetch list to ensure consistency with server
      const res = await getSliders();
      setSliders(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const handleToggleActive = async (item) => {
    if (!canPublish) {
      showNoPerm("publish sliders");
      return;
    }
    try {
      const nextActive = item.is_active ? 0 : 1;
      const { data } = await updateSlider(item.id, { is_active: nextActive });
      setSliders((prev) =>
        prev.map((item) =>
          item.id === data?.data?.id ? data.data : item,
        ),
      );
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setError("Failed to update slider status.");
    }
  };

  if (loading) {
    return <p className="text-white/70">Loading sliders...</p>;
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Sliders</h2>
          <p className="text-sm text-white/65">Manage hero sliders on website home page.</p>
        </div>
        {/* <button
          type="button"
          onClick={() => (canAdd ? navigate("/sliders/new") : showNoPerm("add sliders"))}
          className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-black hover:bg-[var(--admin-primary-strong)]"
        >
          + Add Slider
        </button> */}
      </header>

      {toast.show ? (
        <div className="fixed right-5 top-5 z-[220] rounded-xl border border-red-400/30 bg-red-500/90 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast.text}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      ) : null}

      {sliders.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[var(--admin-bg)] p-6 text-white/70">
          No sliders found. Add your first slider.
        </div>
      ) : (
        <div className="grid gap-4">
          {sliders.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--admin-bg)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
                <img
                  src={resolveImage(item.image)}
                  alt={item.title || "Slider"}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-44 w-full object-cover md:h-full"
                />
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4a340]">
                        {item.heading || "Heading"}
                      </p>
                      <h3 className="mt-1 break-words text-2xl font-bold text-white">
                        {item.title || "Untitled Slider"}
                      </h3>
                      <p className="mt-2 break-words text-sm text-white/70">
                        {item.subtitle || item.sub || "No subtitle"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                          Status: {item.is_active ? "Active" : "Inactive"}
                        </span>
                        <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                          Primary: {item.button_text || "Shop Now"}
                        </span>
                        <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                          Secondary: {item.secondary_button_text || "Our Story"}
                        </span>
                        <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                          Order: {Number(item.sort_order || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        className={
                          item.is_active
                            ? "rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                            : "rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                        }
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </button>
                      <button
                        type="button"
                        onClick={() => (canEdit ? navigate(`/sliders/edit/${item.id}`) : showNoPerm("edit sliders"))}
                        className={`rounded-lg px-4 py-2 text-sm ${canEdit ? "bg-[#1f8b4c] text-white hover:bg-[var(--admin-primary-strong)]" : "border border-white/20 bg-white/10 text-white/60"}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
