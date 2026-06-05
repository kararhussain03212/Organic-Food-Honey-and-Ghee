import { useMemo, useState } from "react";
import { useAuth } from "../context/useAuth";
import { uploadImage } from "../api/uploadApi";
import { getBackendRoot } from "../api/runtimeApi";

export default function Admin() {
  const { user, updateProfile, changePassword } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    designation: user?.designation || "",
    bio: user?.bio || "",
    profile_photo: user?.profile_photo || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    nextPassword: "",
    confirmPassword: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const photoUrl = useMemo(() => {
    const value = profileForm.profile_photo || user?.profile_photo || "";
    if (!value) return "";
    if (value.startsWith("http")) return value;
    const base = getBackendRoot();
    if (value.startsWith("/")) return base + value;
    return base + "/uploads/" + value;
  }, [profileForm.profile_photo, user?.profile_photo]);

  const onUploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const path = await uploadImage(file, "profiles");
      if (path) {
        setProfileForm((prev) => ({ ...prev, profile_photo: path }));
        setMessage("Photo uploaded. Click Save Profile to apply.");
        setError("");
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to upload photo.");
      setMessage("");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await updateProfile(profileForm);
      setMessage("Profile updated successfully.");
      setError("");
    } catch (err) {
      setError(err?.message || "Failed to update profile.");
      setMessage("");
    } finally {
      setSavingProfile(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (passwordForm.nextPassword !== passwordForm.confirmPassword) {
      setError("New password and confirm password do not match.");
      setMessage("");
      return;
    }

    try {
      setSavingPassword(true);
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        nextPassword: passwordForm.nextPassword,
      });
      setPasswordForm({ currentPassword: "", nextPassword: "", confirmPassword: "" });
      setMessage("Password changed successfully.");
      setError("");
    } catch (err) {
      setError(err?.message || "Failed to change password.");
      setMessage("");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-5xl font-bold text-white">Settings</h2>
        <p className="mt-1 text-lg text-white/70">Manage your profile photo, designation, account email and security password.</p>
      </header>

      {message ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300">{message}</div> : null}
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div> : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-3xl font-semibold text-white">Profile</h3>
              <p className="text-lg text-white/70">Update your personal account details.</p>
            </div>
            <span className="rounded-full border border-blue-500/40 bg-blue-500/20 px-3 py-1 text-sm font-semibold text-blue-200 capitalize">{user?.role || "admin"}</span>
          </div>

          <form onSubmit={submitProfile} className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
            <div className="space-y-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4">
              <div className="rounded-xl border border-dashed border-[var(--admin-border)] p-4 text-center">
                <div className="mx-auto h-36 w-36 overflow-hidden rounded-full border border-[var(--admin-border)] bg-[var(--admin-card)]">
                  {photoUrl ? <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" /> : null}
                </div>
                <p className="mt-3 text-xl font-semibold text-white">Upload a profile photo</p>
                <p className="text-sm text-white/60">JPG, PNG, WEBP up to 2MB</p>
              </div>

              <label className="block w-full rounded-xl bg-[var(--admin-primary)] px-4 py-2 text-center font-semibold text-black hover:bg-[var(--admin-primary-strong)]">
                {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                <input type="file" accept="image/*" onChange={onUploadPhoto} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => setProfileForm((prev) => ({ ...prev, profile_photo: "" }))}
                className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-2 font-semibold text-white/90"
              >
                Remove Photo
              </button>
            </div>

            <div className="space-y-3">
              <label className="block space-y-1">
                <span className="text-lg text-white/85">Full Name</span>
                <input value={profileForm.name} onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white" required />
              </label>

              <label className="block space-y-1">
                <span className="text-lg text-white/85">Email</span>
                <input type="email" value={profileForm.email} onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))} className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white" required />
              </label>

              <label className="block space-y-1">
                <span className="text-lg text-white/85">Designation</span>
                <input value={profileForm.designation} onChange={(e) => setProfileForm((prev) => ({ ...prev, designation: e.target.value }))} placeholder="Senior Editor" className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white" />
              </label>

              <label className="block space-y-1">
                <span className="text-lg text-white/85">Bio</span>
                <textarea rows={4} value={profileForm.bio} onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))} placeholder="Short professional intro..." className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white" />
              </label>

              <button type="submit" disabled={savingProfile} className="rounded-xl bg-[var(--admin-primary)] px-6 py-2.5 font-semibold text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-70">{savingProfile ? "Saving..." : "Save Profile"}</button>
            </div>
          </form>
        </section>

        <div className="space-y-4">
          <form onSubmit={submitPassword} className="space-y-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 md:p-6">
            <h3 className="text-3xl font-semibold text-white">Security</h3>
            <label className="block space-y-1">
              <span className="text-lg text-white/85">Current Password</span>
              <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))} className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white" required />
            </label>
            <label className="block space-y-1">
              <span className="text-lg text-white/85">New Password</span>
              <input type="password" value={passwordForm.nextPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, nextPassword: e.target.value }))} className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white" required />
            </label>
            <label className="block space-y-1">
              <span className="text-lg text-white/85">Confirm New Password</span>
              <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-white" required />
            </label>
            <button type="submit" disabled={savingPassword} className="rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 font-semibold text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-70">{savingPassword ? "Changing..." : "Change Password"}</button>
          </form>

          <section className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 md:p-6">
            <h3 className="text-3xl font-semibold text-white">Account</h3>
            <div className="mt-3 space-y-2 text-lg text-white/85">
              <p>Role: <span className="font-semibold capitalize text-white">{user?.role || "admin"}</span></p>
              <p>Designation: <span className="font-semibold text-white">{profileForm.designation || "-"}</span></p>
              <p>Status: <span className={String(user?.status || "").toLowerCase() === "inactive" ? "font-semibold capitalize text-red-400" : "font-semibold capitalize text-emerald-300"}>{user?.status || "active"}</span></p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
