import { Sidebar, Container } from "../components";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <Sidebar />
      <Container>
        <Outlet />
      </Container>
    </div>
  );
};

export default MainLayout;