import api from "../lib/api";

export async function fetchUserInfo() {
  try {
    const res = await api.get("/users/info");

    if (res.status === 200) {
      return res.data;
    }

    return null;
  } catch (err) {
    console.error("Failed to fetch user info:", err);
    return null;
  }
}
