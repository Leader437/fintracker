import { Container, Sidebar } from "./components";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Sidebar />
      <Container>
        <Outlet />
      </Container>
    </div>
  );
};

export default App;
