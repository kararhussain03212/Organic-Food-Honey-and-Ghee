import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteTestimonial,
  getTestimonials,
  updateTestimonial,
} from "../../api/testimonialApi";
import { useAuth } from "../../context/useAuth";
import { hasPermission } from "../../modules/users/constants";
import { getBackendRoot } from "../../api/runtimeApi";

const FALLBACK_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'><rect width='300' height='300' fill='#171717'/><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' fill='#ffffff' font-family='Arial,sans-serif' font-size='30'>Avatar</text></svg>",
)}`;

export default function TestimonialList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
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
    if (!value) return FALLBACK_AVATAR;
    if (value.startsWith("http")) return value;
    if (value.startsWith("/uploads/")) return apiRoot + value;
    if (value.startsWith("/")) return apiRoot.replace(/\/backend$/, "") + value;
    return apiRoot + "/uploads/" + value;
  };

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const res = await getTestimonials(1, 30);
        const payload = res?.data?.data;
        const rows = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        setTestimonials(rows);
      } catch (err) {
        console.error(err);
        const timedOut = String(err?.code || "").toUpperCase() === "ECONNABORTED";
        setError(timedOut ? "Request timed out. Please try again." : "Failed to load testimonials.");
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const handleDelete = async (id) => {
    if (!canDelete) {
      showNoPerm("delete testimonials");
      return;
    }
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const handleToggleActive = async (item) => {
    if (!canPublish) {
      showNoPerm("publish testimonials");
      return;
    }
    try {
      const nextActive = item.is_active ? 0 : 1;
      const { data } = await updateTestimonial(item.id, { is_active: nextActive });
      setTestimonials((prev) =>
        prev.map((entry) => (entry.id === data?.data?.id ? data.data : entry)),
      );
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setError("Failed to update testimonial status.");
    }
  };

  if (loading) {
    return <p className="text-white/70">Loading testimonials...</p>;
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Testimonials</h2>
          <p className="text-sm text-white/65">
            Manage testimonial cards shown on homepage.
          </p>
        </div>
        <button
          type="button"
          onClick={() => (canAdd ? navigate("/testimonials/new") : showNoPerm("add testimonials"))}
          className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-black hover:bg-[var(--admin-primary-strong)]"
        >
          + Add Testimonial
        </button>
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

      {testimonials.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[var(--admin-bg)] p-6 text-white/70">
          No testimonials found. Add your first testimonial.
        </div>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--admin-bg)]"
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 flex items-center gap-3">
                      <img
                        src={resolveImage(item.avatar)}
                        alt={item.name || "Customer"}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = FALLBACK_AVATAR;
                        }}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {item.name || "Unnamed Customer"}
                        </h3>
                        <p className="text-sm text-white/65">
                          {item.role || "Verified Customer"}
                        </p>
                      </div>
                    </div>

                    <p className="break-words text-sm text-white/75">
                      {item.quote || "No quote text"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                        Rating: {"⭐".repeat(Number(item.rating || 5))}
                      </span>
                      <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                        Product: {item.product || "-"}
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
                      onClick={() => (canEdit ? navigate(`/testimonials/edit/${item.id}`) : showNoPerm("edit testimonials"))}
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
