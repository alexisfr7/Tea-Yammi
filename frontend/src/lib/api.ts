const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getGallery() {
  const res = await fetch(`${API_URL}/api/gallery`);
  if (!res.ok) throw new Error("Failed to fetch gallery");
  return res.json();
}

export async function getStatus() {
  const res = await fetch(`${API_URL}/api/status`);
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json();
}
