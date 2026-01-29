export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("hotel_token");
}
export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("hotel_token");
  window.location.href = "/";
}
