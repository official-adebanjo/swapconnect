export const isLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("authToken"); // or whatever you store auth with
};
