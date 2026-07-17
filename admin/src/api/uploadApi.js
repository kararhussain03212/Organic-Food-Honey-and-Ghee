import api from "./axios";

// Uploads get 10 minutes instead of the global 15s API timeout.
const UPLOAD_TIMEOUT_MS = 600000;

export const uploadImage = async (file, folder = "misc", oldPath = "") => {
  if (!file) {
    throw new Error("No file selected");
  }

  const payload = new FormData();
  payload.append("file", file);
  payload.append("folder", folder);
  if (oldPath) payload.append("old_path", oldPath);

  try {
    // Let the browser set the multipart boundary automatically.
    // Large files (videos) can take minutes on real connections, so the
    // global 15s API timeout must not apply here.
    const { data } = await api.post("/admin/upload", payload, {
      timeout: UPLOAD_TIMEOUT_MS,
    });
    return data?.data?.path || "";
  } catch (error) {
    const apiError =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Image upload failed";
    throw new Error(apiError);
  }
};

export const uploadVideo = async (file, folder = "misc", oldPath = "") => {
  if (!file) {
    throw new Error("No file selected");
  }

  const payload = new FormData();
  payload.append("file", file);
  payload.append("folder", folder);
  if (oldPath) payload.append("old_path", oldPath);

  try {
    const { data } = await api.post("/admin/upload", payload, {
      timeout: UPLOAD_TIMEOUT_MS,
    });
    return data?.data?.path || "";
  } catch (error) {
    const apiError =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Video upload failed";
    throw new Error(apiError);
  }
};
