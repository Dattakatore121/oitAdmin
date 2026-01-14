import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    // 🔥 Clear session
    localStorage.clear();

    // 🚀 HARD redirect (no router loop)
    window.location.href = "/";
  }, []);

  return null;
}
