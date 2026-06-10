import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteBlog, getBlogs, updateBlog } from "../../api/blogApi";
import { getBackendRoot } from "../../api/runtimeApi";
import { useAuth } from "../../context/useAuth";
import { hasPermission } from "../../modules/users/constants";

const API_ROOT = getBackendRoot();

function toImageUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("/uploads/")) return `${API_ROOT}${raw}`;
  if (raw.startsWith("/")) return raw;
  return `${API_ROOT}/uploads/${raw}`;
}

export default function BlogList() {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [toast, setToast]     = useState({ show: false, text: "" });

  const canAdd     = hasPermission(user, "create_content");
  const canEdit    = hasPermission(user, "edit_content");
  const canDelete  = hasPermission(user, "delete_content");
  const canPublish = hasPermission(user, "publish_content");

  const showNoPerm = (action) => setToast({ show: true, text: `You do not have permission to ${action}.` });

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast({ show: false, text: "" }), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getBlogs();
        setBlogs(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load blog posts.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!canDelete) { showNoPerm("delete blog posts"); return; }
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const togglePublished = async (item) => {
    if (!canPublish) { showNoPerm("publish blog posts"); return; }
    try {
      const next = item.is_published ? 0 : 1;
      const res = await updateBlog(item.id, { is_published: next });
      setBlogs((prev) => prev.map((x) => (x.id === item.id ? res.data?.data || { ...x, is_published: next } : x)));
    } catch (err) {
      console.error(err);
      setError("Failed to update status.");
    }
  };

  if (loading) return <p className="text-white/70">Loading blogs…</p>;

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Blog Posts</h2>
          <p className="text-sm text-white/65">Manage blog content for Home, Blog list, and Blog detail pages.</p>
        </div>
        <button
          type="button"
          onClick={() => canAdd ? navigate("/blogs/new") : showNoPerm("add blog posts")}
          className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-black hover:bg-[var(--admin-primary-strong)]"
        >
          + Add Blog
        </button>
      </header>

      {toast.show && (
        <div className="fixed right-5 top-5 z-[220] rounded-xl border border-red-400/30 bg-red-500/90 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast.text}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      )}

      {blogs.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[var(--admin-bg)] p-6 text-white/70">
          No blog posts yet. Add your first post.
        </div>
      ) : (
        <div className="grid gap-4">
          {blogs.map((item) => {
            const published = item.is_published === 1 || item.is_published === true;
            return (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-4">
                    {item.image && (
                      <img
                        src={toImageUrl(item.image)}
                        alt={item.title || "Blog"}
                        className="h-20 w-32 flex-shrink-0 rounded-lg object-cover"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-white">{item.title || "Untitled Blog"}</h3>
                      <p className="mt-1 text-sm text-white/65">
                        {item.category || "Blog"} • {item.slug || "-"}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-white/70">
                        {item.excerpt || "No excerpt"}
                      </p>
                      <p className="mt-1 text-xs text-white/60">
                        {item.read_time ? `${item.read_time} min read` : "Read time not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => togglePublished(item)}
                      className={published
                        ? "rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                        : "rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"}
                    >
                      {published ? "Published" : "Draft"}
                    </button>
                    <button
                      type="button"
                      onClick={() => canEdit ? navigate(`/blogs/edit/${item.id}`) : showNoPerm("edit blog posts")}
                      className="rounded-lg bg-[#1f8b4c] px-4 py-2 text-sm text-white hover:bg-[var(--admin-primary-strong)]"
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
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
