import api from "./axios";

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
    const { data } = await api.post("/admin/upload", payload);
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
    const { data } = await api.post("/admin/upload", payload);
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
