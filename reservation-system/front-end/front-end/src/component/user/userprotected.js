import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

const UserProtectedRoutes = () => {
  const [cookies] = useCookies(["user"]);

  let tokenExists = false;
  let isUser = false;

  if (cookies.user && cookies.user !== undefined) {
    tokenExists = true;
  } else {
    tokenExists = false;
  }

  if (localStorage.getItem("role") === "0") {
    isUser = true;
  } else {
    isUser = false;
  }

  return tokenExists && isUser ? <Outlet /> : <Navigate to="/" />;
};

export default UserProtectedRoutes;
