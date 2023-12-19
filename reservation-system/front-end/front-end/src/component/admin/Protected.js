import { useCookies } from "react-cookie";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoutes = () => {
  const [cookies] = useCookies(["user"]);

  let tokenExists = false;
  let isAdmin = false;

  if (cookies.user && cookies.user !== undefined) {
    tokenExists = true;
  } else {
    tokenExists = false;
  }

  if (localStorage.getItem("role") === "1") {
    isAdmin = true;
  } else {
    isAdmin = false;
  }

  return tokenExists && isAdmin ? <Outlet /> : <Navigate to="/admin" />;
};

export default AdminProtectedRoutes;
