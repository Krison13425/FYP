import { useEffect } from "react";
import NavBar from "../global/Navbar";
import Header from "./Header";

const MainPage = () => {
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  return (
    <>
      <NavBar />
      <Header />
    </>
  );
};

export default MainPage;
