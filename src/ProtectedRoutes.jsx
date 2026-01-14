import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");

  // 🔒 Login नसेल तर थेट login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Login असेल तर पुढचे routes allow
  return <Outlet />;
};

export default ProtectedRoutes;
